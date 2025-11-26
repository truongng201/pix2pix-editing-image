"use client"

import { useState, useRef, useCallback } from "react"
import { ImageUploader } from "./image-uploader"
import { TransformationPanel } from "./transformation-panel"
import { ImagePreview } from "./image-preview"
import { PromptInput } from "./prompt-input"
import { Download, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export type FilterType =
  | "none"
  | "grayscale"
  | "sepia"
  | "vintage"
  | "cold"
  | "warm"
  | "high-contrast"
  | "blur"
  | "sharpen"
  | "invert"

export function PhotoEditor() {
  const [image, setImage] = useState<string | null>(null)
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<FilterType>("none")
  const [isProcessing, setIsProcessing] = useState(false)
  const [aiPrompt, setAiPrompt] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setImage(result)
      setOriginalImage(result)
      setActiveFilter("none")
      setAiPrompt(null)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleReset = useCallback(() => {
    setImage(originalImage)
    setActiveFilter("none")
    setAiPrompt(null)
  }, [originalImage])

  const handleDownload = useCallback(() => {
    if (!canvasRef.current) return
    const link = document.createElement("a")
    link.download = `edited-photo-${Date.now()}.png`
    link.href = canvasRef.current.toDataURL("image/png")
    link.click()
  }, [])

  const handleClearImage = useCallback(() => {
    setImage(null)
    setOriginalImage(null)
    setActiveFilter("none")
    setAiPrompt(null)
  }, [])

  const handleAiPrompt = useCallback((prompt: string) => {
    setAiPrompt(prompt)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">Photo Studio</h1>
        <p className="text-muted-foreground text-lg">Transform your photos with filters and AI</p>
      </header>

      {!image ? (
        <ImageUploader onUpload={handleImageUpload} />
      ) : (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handleClearImage} className="gap-2 bg-transparent">
              Upload New
            </Button>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={activeFilter === "none" && !aiPrompt}
                className="gap-2 bg-transparent"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
              <Button onClick={handleDownload} className="gap-2">
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-8">
            <ImagePreview
              image={image}
              originalImage={originalImage}
              filter={activeFilter}
              canvasRef={canvasRef}
              isProcessing={isProcessing}
            />
            <div className="space-y-6">
              <PromptInput
                onSubmit={handleAiPrompt}
                isProcessing={isProcessing}
                disabled={true} // Enable when fal integration is added
              />
              <TransformationPanel
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                setIsProcessing={setIsProcessing}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
