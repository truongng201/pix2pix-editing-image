"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { Upload, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploaderProps {
  onUpload: (file: File) => void
}

export function ImageUploader({ onUpload }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file && file.type.startsWith("image/")) {
        onUpload(file)
      }
    },
    [onUpload],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        onUpload(file)
      }
    },
    [onUpload],
  )

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        "relative border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 cursor-pointer group",
        isDragging
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
      )}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="flex flex-col items-center gap-4">
        <div
          className={cn(
            "w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300",
            isDragging
              ? "bg-primary text-primary-foreground scale-110"
              : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
          )}
        >
          {isDragging ? <Upload className="w-10 h-10" /> : <ImageIcon className="w-10 h-10" />}
        </div>
        <div>
          <p className="text-xl font-medium text-foreground mb-1">
            {isDragging ? "Drop your image here" : "Drop an image or click to upload"}
          </p>
          <p className="text-muted-foreground">Supports JPG, PNG, WebP up to 10MB</p>
        </div>
      </div>
    </div>
  )
}
