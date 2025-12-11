"use client"

import { Play, Loader2, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"

interface HeaderProps {
  onStartProcessing: () => void
  onStopProcessing: () => void
}

export function Header({ onStartProcessing, onStopProcessing }: HeaderProps) {
  const { queue, isProcessing, apiConfig } = useStore()
  const pendingCount = queue.filter((i) => i.status === "pending").length
  const hasApiKey = !!apiConfig.apiKey

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background sticky top-0 z-10">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-sm font-medium tracking-tight text-foreground">Batch Processing</h1>
        <p className="text-xs text-muted-foreground">
          {hasApiKey ? "Using Gemini" : "Configure API key to start"}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {isProcessing && (
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-2 text-xs h-8 px-4 rounded-sm bg-transparent"
            onClick={onStopProcessing}
          >
            <Square className="w-3 h-3 fill-current" strokeWidth={1.5} />
            Stop
          </Button>
        )}
        <Button
          size="sm"
          className="flex items-center gap-2 text-xs h-8 px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm"
          onClick={onStartProcessing}
          disabled={isProcessing || pendingCount === 0 || !hasApiKey}
        >
          {isProcessing ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={1.5} />
          ) : (
            <Play className="w-3.5 h-3.5" strokeWidth={1.5} />
          )}
          {isProcessing ? `Processing...` : `Start (${pendingCount})`}
        </Button>
      </div>
    </header>
  )
}
