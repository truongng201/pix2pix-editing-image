"use client"

import type React from "react"

import { useState } from "react"
import { Sparkles, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PromptInputProps {
  onSubmit: (prompt: string) => void
  isProcessing: boolean
  disabled?: boolean
}

const suggestions = [
  "Make it look like a painting",
  "Turn into a pencil sketch",
  "Add a sunset atmosphere",
  "Make it look vintage",
  "Convert to anime style",
  "Add dramatic lighting",
  "Make it look like winter",
  "Turn into watercolor art",
]

export function PromptInput({ onSubmit, isProcessing, disabled }: PromptInputProps) {
  const [prompt, setPrompt] = useState("")

  const handleSubmit = () => {
    if (prompt.trim() && !isProcessing && !disabled) {
      onSubmit(prompt.trim())
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion)
    if (!isProcessing && !disabled) {
      onSubmit(suggestion)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">AI Transform</h2>
      </div>

      {/* Prompt Input */}
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe how you want to transform your image..."
          disabled={disabled || isProcessing}
          className={cn(
            "w-full min-h-[80px] px-4 py-3 pr-12 rounded-xl",
            "bg-muted/50 border border-border",
            "text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
            "resize-none transition-all duration-200",
            (disabled || isProcessing) && "opacity-50 cursor-not-allowed",
          )}
        />
        <Button
          size="icon"
          onClick={handleSubmit}
          disabled={!prompt.trim() || isProcessing || disabled}
          className="absolute bottom-3 right-3 h-8 w-8 rounded-lg"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>

      {/* Suggestions */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground font-medium">Try these:</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              disabled={disabled || isProcessing}
              className={cn(
                "px-3 py-1.5 text-xs rounded-full",
                "bg-muted/50 text-muted-foreground",
                "border border-border",
                "hover:bg-primary/10 hover:text-primary hover:border-primary/30",
                "transition-all duration-200",
                (disabled || isProcessing) && "opacity-50 cursor-not-allowed",
              )}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}
