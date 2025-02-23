import { Button } from "@/components/ui/button"
import { MessageSquarePlus } from "lucide-react"

interface StartChatProps {
  onNewChat: () => void
}

export default function StartChat({ onNewChat }: StartChatProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <MessageSquarePlus className="w-16 h-16 text-gray-400 mb-4" />
      <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">Welcome to platformance.io Chat</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
        Start a new conversation or select an existing chat from the sidebar to begin.
      </p>
      <Button onClick={onNewChat} className="flex items-center">
        <MessageSquarePlus className="mr-2 h-4 w-4" />
        Start a New Chat
      </Button>
    </div>
  )
}

