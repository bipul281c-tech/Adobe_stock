"use client"

import type React from "react"

import { useCallback } from "react"
import { Plus } from "lucide-react"
import { useStore } from "@/lib/store"
import type { QueueItem } from "@/lib/types"

export function UploadZone() {
  const { addToQueue } = useStore()

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return

      const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"))

      const newItems: QueueItem[] = imageFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        status: "pending",
        metadata: null,
        createdAt: new Date(),
      }))

      addToQueue(newItems)
    },
    [addToQueue],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <section>
      <div
        className="border border-dashed border-border hover:border-muted-foreground bg-card/50 hover:bg-card p-8 md:p-10 flex flex-col items-center justify-center transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="w-10 h-10 border border-border flex items-center justify-center mb-4 text-muted-foreground">
          <Plus className="w-5 h-5" strokeWidth={1.5} />
        </div>
        <p className="text-sm text-foreground mb-1">Drop images here</p>
        <p className="text-xs text-muted-foreground mb-4">PNG, JPG, JPEG supported</p>
        <label className="px-4 py-2 text-xs text-foreground bg-secondary hover:bg-secondary/80 border border-border cursor-pointer transition-colors">
          Browse Files
          <input
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
      </div>
    </section>
  )
}
