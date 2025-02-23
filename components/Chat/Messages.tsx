"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Bot, User } from "lucide-react"
import { marked } from "marked"
import { useEffect, useRef } from "react"
import type { Message } from "../../app/page"

interface MessageListProps {
  messages: Message[]
}

export default function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-[70vh] bg-gray-50 dark:bg-gray-800 rounded-t-lg">
        <p className="text-gray-500 dark:text-gray-400">No messages yet. Start a conversation!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 mb-4 h-[70vh] scroll-bar overflow-y-auto px-4 py-4 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
      <AnimatePresence initial={false}>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`flex items-end ${message.role === "user" ? "justify-end" : "justify-start"} space-x-2 mb-4`}
          >
            {message.role === "assistant" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            <div
              className={`relative max-w-[70%] rounded-2xl p-4 shadow-md ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              }`}
            >
              <div
                className="message-content text-sm"
                dangerouslySetInnerHTML={{
                  __html: marked(message.content) || "",
                }}
              />
              {/* <div
                className={`absolute w-4 h-4 rotate-45 ${
                  message.role === "user"
                    ? "bg-blue-500 right-0 bottom-[10px] -translate-x-1/2"
                    : "bg-white dark:bg-gray-700 left-0 bottom-[10px] translate-x-1/2"
                }`}
              ></div> */}
            </div>
            {message.role === "user" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  )
}

