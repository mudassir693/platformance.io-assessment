"use client"

import { MessageSkeleton } from "@/components/Chat/AnalyzingSkeleton"
import Sidebar from "@/components/Chat/Sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { H4 } from "@/components/ui/typography"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { v4 as uuidv4 } from "uuid"
import MessageInput from "../components/Chat/MessageInput"
import MessageList from "../components/Chat/Messages"
import StartChat from "../components/Chat/StartChat"

export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

export type Chat = {
  id: string
  name: string
  messages: Message[]
}

const CHATS_STORAGE_KEY = "platformance_chats"

export default function Chat() {
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const savedChats = localStorage.getItem(CHATS_STORAGE_KEY)
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats)
      setChats(parsedChats)
      if (parsedChats.length > 0) {
        setCurrentChatId(parsedChats[0].id)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats))
  }, [chats])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const createNewChat = () => {
    const newChat: Chat = {
      id: uuidv4(),
      name: `New Chat ${chats.length + 1}`,
      messages: [],
    }
    setChats((prevChats) => [newChat, ...prevChats])
    setCurrentChatId(newChat.id)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || !currentChatId) {
      toast.error("Please enter a message and select a chat.")
      return
    }

    const urlRegex = /(https?:\/\/[^\s]+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g
    const foundUrls = input.match(urlRegex)
    const extractedUrl = foundUrls ? `https://${foundUrls[0].replace(/^https?:\/\//, "")}` : null

    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: input,
    }

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === currentChatId ? { ...chat, messages: [...chat.messages, userMessage] } : chat,
      ),
    )

    setInput("")
    setIsTyping(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: extractedUrl, message: input }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Server error. Please try again.")
      }

      const botMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: "",
      }

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === currentChatId ? { ...chat, messages: [...chat.messages, botMessage] } : chat,
        ),
      )

      const reader = response.body?.getReader()
      if (!reader) throw new Error("Failed to read response stream.")

      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        const chunks = buffer.split("\n")
        buffer = chunks.pop() || ""

        for (const chunk of chunks) {
          if (!chunk.trim() || chunk === "data: [DONE]") continue

          try {
            const json = JSON.parse(chunk.replace(/^data: /, ""))
            if (json.choices?.[0]?.delta?.content) {
              setChats((prevChats) =>
                prevChats.map((chat) =>
                  chat.id === currentChatId
                    ? {
                        ...chat,
                        messages: chat.messages.map((m) =>
                          m.id === botMessage.id ? { ...m, content: m.content + json.choices[0].delta.content } : m,
                        ),
                      }
                    : chat,
                ),
              )
            }
          } catch (error) {
            console.error("Error parsing chunk:", error)
          }
        }
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error(error instanceof Error ? error.message : "Something went wrong!")
    } finally {
      setIsTyping(false)
    }
  }

  const currentChat = chats.find((chat) => chat.id === currentChatId)

  return (
    <div className="relative flex h-screen overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
      <Sidebar chats={chats} currentChatId={currentChatId} onSelectChat={setCurrentChatId} onNewChat={createNewChat} />
      <div className="flex-1 flex flex-col p-5 overflow-hidden">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <H4 className="text-center text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200">
            platformance.io Assessment
          </H4>
        </motion.div>
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <Card className="w-full max-w-4xl shadow-lg max-h-full flex flex-col ml-[64px] md:ml-[0px]">
            <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
              {currentChat ? (
                <>
                  <MessageList messages={currentChat.messages} />
                  <AnimatePresence>{isTyping && <MessageSkeleton />}</AnimatePresence>
                  <MessageInput
                    input={input}
                    handleInputChange={handleInputChange}
                    onSubmit={handleSubmit}
                    disabled={isTyping}
                  />
                </>
              ) : (
                <StartChat onNewChat={createNewChat} />
              )}
            </CardContent>
          </Card>
        </div>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </div>
  )
}

