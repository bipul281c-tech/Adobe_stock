"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { useStore } from "@/lib/store"
import type { QueueItem } from "@/lib/types"
import { ADOBE_STOCK_CATEGORIES } from "@/lib/types"

interface EditMetadataDialogProps {
  item: QueueItem
  onClose: () => void
}

export function EditMetadataDialog({ item, onClose }: EditMetadataDialogProps) {
  const { updateQueueItem } = useStore()
  const [title, setTitle] = useState(item.metadata?.title || "")
  const [keywords, setKeywords] = useState(item.metadata?.keywords.join(", ") || "")
  const [category, setCategory] = useState(item.metadata?.category || "")

  const handleSave = () => {
    const keywordsArray = keywords
      .split(",")
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean)

    updateQueueItem(item.id, {
      metadata: {
        title,
        keywords: keywordsArray,
        category,
        titleLength: title.length,
      },
    })
    onClose()
  }

  const isOptimal = title.length >= 195

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-medium text-foreground">Edit Metadata</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Title</label>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 200))}
              placeholder="Enter SEO-optimized title (max 200 chars)..."
              rows={3}
              className="w-full px-3 py-2 text-sm bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
            />
            <p className="text-[10px] mt-1 font-mono">
              <span className={isOptimal ? "text-green-500" : "text-yellow-500"}>{title.length}/200 chars</span>
              {!isOptimal && <span className="text-muted-foreground ml-2">(195+ recommended)</span>}
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border text-foreground focus:outline-none focus:border-primary"
            >
              <option value="">Select category...</option>
              {ADOBE_STOCK_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Keywords */}
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Keywords</label>
            <textarea
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="keyword1, keyword2, keyword3..."
              rows={4}
              className="w-full px-3 py-2 text-sm bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
            />
            <p className="text-[10px] text-muted-foreground mt-1 font-mono">
              {keywords.split(",").filter((k) => k.trim()).length}/49 keywords
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-muted-foreground hover:text-foreground border border-border hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
