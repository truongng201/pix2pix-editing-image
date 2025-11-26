"use client"

import type React from "react"

import type { FilterType } from "./photo-editor"
import { cn } from "@/lib/utils"
import { Palette, Sun, Snowflake, Contrast, CircleDot, Sparkles, Moon, Aperture, FlipHorizontal } from "lucide-react"

interface TransformationPanelProps {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
  setIsProcessing: (processing: boolean) => void
}

const filters: { id: FilterType; name: string; icon: React.ReactNode }[] = [
  { id: "none", name: "Original", icon: <CircleDot className="w-5 h-5" /> },
  { id: "grayscale", name: "Grayscale", icon: <Moon className="w-5 h-5" /> },
  { id: "sepia", name: "Sepia", icon: <Palette className="w-5 h-5" /> },
  { id: "vintage", name: "Vintage", icon: <Sparkles className="w-5 h-5" /> },
  { id: "warm", name: "Warm", icon: <Sun className="w-5 h-5" /> },
  { id: "cold", name: "Cold", icon: <Snowflake className="w-5 h-5" /> },
  { id: "high-contrast", name: "Contrast", icon: <Contrast className="w-5 h-5" /> },
  { id: "blur", name: "Blur", icon: <Aperture className="w-5 h-5" /> },
  { id: "invert", name: "Invert", icon: <FlipHorizontal className="w-5 h-5" /> },
]

export function TransformationPanel({ activeFilter, onFilterChange, setIsProcessing }: TransformationPanelProps) {
  const handleFilterClick = (filter: FilterType) => {
    setIsProcessing(true)
    onFilterChange(filter)
    setTimeout(() => setIsProcessing(false), 100)
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-foreground mb-1">Quick Filters</h2>
      <p className="text-xs text-muted-foreground mb-4">Instant canvas-based effects</p>
      <div className="grid grid-cols-3 gap-3">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleFilterClick(filter.id)}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200",
              activeFilter === filter.id
                ? "bg-primary text-primary-foreground shadow-lg scale-105"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {filter.icon}
            <span className="text-xs font-medium">{filter.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
