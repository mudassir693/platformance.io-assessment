import type { Chat } from "@/app/page";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MessageSquarePlus } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  chats: Chat[]
  currentChatId: string | null
  onSelectChat: (chatId: string) => void
  onNewChat: () => void
}

export default function Sidebar({ chats, currentChatId, onSelectChat, onNewChat }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)
  
    const toggleSidebar = () => {
      setIsCollapsed(!isCollapsed)
    }
  
    return (
      <motion.div
        className={`bg-gray-100 dark:bg-gray-800 flex flex-col h-full ${
          isCollapsed ? 'w-16' : 'w-64'
        } transition-all duration-300 ease-in-out absolute md:relative z-50`}
        animate={{ width: isCollapsed ? 64 : 256 }}
      >
        <Button
          onClick={toggleSidebar}
          variant="ghost"
          className="absolute top-1  right-4 -bottom-10 bg-gray-300 dark:bg-gray-700 p-1 rounded-full"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
        
        <div className="flex-1 overflow-y-auto mt-10 p-4">
          {chats.map((chat) => (
            <Button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              variant={chat.id === currentChatId ? "secondary" : "ghost"}
              className={`w-full justify-start mb-2 text-left ${
                isCollapsed ? 'px-2' : 'px-4'
              }`}
            >
              <MessageSquarePlus className="h-4 w-4 mr-2" />
              {!isCollapsed && <span className="truncate">{chat.name}</span>}
            </Button>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Button onClick={onNewChat} className="w-full">
            <MessageSquarePlus className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">New Chat</span>}
          </Button>
        </div>
        
      </motion.div>
    )
  }
  