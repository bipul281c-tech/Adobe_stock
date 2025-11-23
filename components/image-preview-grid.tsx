"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ImagePreviewGridProps {
  files: File[]
}

export function ImagePreviewGrid({ files }: ImagePreviewGridProps) {
  const [previews, setPreviews] = useState<string[]>([])

  useEffect(() => {
    const newPreviews: string[] = []
    files.slice(0, 12).forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        newPreviews.push(reader.result as string)
        if (newPreviews.length === Math.min(files.length, 12)) {
          setPreviews([...newPreviews])
        }
      }
      reader.readAsDataURL(file)
    })

    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview))
    }
  }, [files])

  return (
    <ScrollArea className="h-[240px] neo-border bg-background p-4">
      <div className="grid grid-cols-4 gap-3">
        {previews.map((preview, index) => (
          <div
            key={index}
            className="aspect-square neo-border overflow-hidden bg-muted hover:scale-105 transition-transform"
          >
            <img
              src={preview || "/placeholder.svg"}
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {files.length > 12 && (
          <div className="aspect-square neo-border bg-muted flex items-center justify-center">
            <span className="text-2xl font-black text-foreground">+{files.length - 12}</span>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
