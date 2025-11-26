"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import type { FilterType } from "./photo-editor"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImagePreviewProps {
  image: string
  originalImage: string | null
  filter: FilterType
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  isProcessing: boolean
}

const getFilterStyle = (filter: FilterType): string => {
  switch (filter) {
    case "grayscale":
      return "grayscale(100%)"
    case "sepia":
      return "sepia(100%)"
    case "vintage":
      return "sepia(50%) contrast(90%) brightness(90%)"
    case "warm":
      return "sepia(30%) saturate(140%) brightness(105%)"
    case "cold":
      return "saturate(80%) brightness(105%) hue-rotate(10deg)"
    case "high-contrast":
      return "contrast(150%) saturate(110%)"
    case "blur":
      return "blur(3px)"
    case "invert":
      return "invert(100%)"
    default:
      return "none"
  }
}

export function ImagePreview({ image, originalImage, filter, canvasRef, isProcessing }: ImagePreviewProps) {
  const imageRef = useRef<HTMLImageElement>(null)
  const [showOriginal, setShowOriginal] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    if (!imageRef.current || !canvasRef.current || !imageLoaded) return

    const img = imageRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight

    ctx.filter = getFilterStyle(filter)
    ctx.drawImage(img, 0, 0)
  }, [filter, canvasRef, imageLoaded, image])

  return (
    <div className="space-y-4">
      <div className="relative bg-muted/30 rounded-2xl overflow-hidden border border-border">
        <div
          className={cn(
            "relative aspect-video flex items-center justify-center transition-opacity duration-300",
            isProcessing && "opacity-50",
          )}
        >
          {/* Hidden image for reference */}
          <img
            ref={imageRef}
            src={image || "/placeholder.svg"}
            alt="Source"
            className="hidden"
            crossOrigin="anonymous"
            onLoad={() => setImageLoaded(true)}
          />

          {/* Visible canvas with filter applied */}
          <canvas
            ref={canvasRef}
            className={cn(
              "max-w-full max-h-full object-contain transition-opacity duration-300",
              showOriginal && "opacity-0",
            )}
          />

          {/* Original image overlay for comparison */}
          {originalImage && showOriginal && (
            <img
              src={originalImage || "/placeholder.svg"}
              alt="Original"
              className="absolute inset-0 w-full h-full object-contain"
            />
          )}

          {/* Processing indicator */}
          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Compare button */}
        {filter !== "none" && (
          <Button
            variant="secondary"
            size="sm"
            className="absolute bottom-4 right-4 gap-2 shadow-lg"
            onMouseDown={() => setShowOriginal(true)}
            onMouseUp={() => setShowOriginal(false)}
            onMouseLeave={() => setShowOriginal(false)}
            onTouchStart={() => setShowOriginal(true)}
            onTouchEnd={() => setShowOriginal(false)}
          >
            {showOriginal ? (
              <>
                <EyeOff className="w-4 h-4" />
                Showing Original
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Hold to Compare
              </>
            )}
          </Button>
        )}
      </div>

      {/* Filter name badge */}
      <div className="flex items-center justify-center">
        <span className="px-4 py-1.5 bg-muted rounded-full text-sm font-medium text-muted-foreground">
          {filter === "none"
            ? "Original Photo"
            : `${filter.charAt(0).toUpperCase() + filter.slice(1).replace("-", " ")} Filter Applied`}
        </span>
      </div>
    </div>
  )
}
