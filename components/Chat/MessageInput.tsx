import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import type { ChangeEvent, FormEvent } from "react"

interface MessageInputProps {
  input: string
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  disabled: boolean
}

export default function MessageInput({ input, handleInputChange, onSubmit, disabled }: MessageInputProps) {
  return (
    <form onSubmit={onSubmit} className="flex items-center space-x-2 bg-background p-2 rounded-lg shadow-md">
      <Input
        value={input}
        onChange={handleInputChange}
        placeholder="How can I help you?"
        className="flex-grow bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
        disabled={disabled}
      />
      <Button
        type="submit"
        size="icon"
        disabled={disabled || !input.trim()}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  )
}

