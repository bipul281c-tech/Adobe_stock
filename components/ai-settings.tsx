"use client"

import { Minus, Plus, AlertTriangle, HelpCircle } from "lucide-react"
import { useStore } from "@/lib/store"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

export function AISettings() {
  const { settings, updateSettings } = useStore()

  return (
    <section>
      <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Processing Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Title Length Target */}
        <div className="p-4 border border-border bg-card">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-1">
              <label className="text-xs text-muted-foreground">Title Length</label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-3 h-3 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>Target character count for AI-generated titles</TooltipContent>
              </Tooltip>
            </div>
            <span className="text-xs font-mono text-foreground">{settings.titleLengthTarget} chars</span>
          </div>
          <input
            type="range"
            className="w-full accent-primary"
            min="100"
            max="200"
            value={settings.titleLengthTarget}
            onChange={(e) => updateSettings({ titleLengthTarget: Number.parseInt(e.target.value) })}
          />
          <p className="text-xs text-muted-foreground mt-2">Adobe Stock max: 200</p>
        </div>

        {/* Keywords Count */}
        <div className="p-4 border border-border bg-card">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-1">
              <label className="text-xs text-muted-foreground">Keywords</label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-3 h-3 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>Number of keywords to generate per image</TooltipContent>
              </Tooltip>
            </div>
            <span className="text-xs font-mono text-foreground">{settings.keywordsCount}</span>
          </div>
          <input
            type="range"
            className="w-full accent-primary"
            min="10"
            max="49"
            value={settings.keywordsCount}
            onChange={(e) => updateSettings({ keywordsCount: Number.parseInt(e.target.value) })}
          />
          <p className="text-xs text-muted-foreground mt-2">Adobe Stock max: 49</p>
        </div>

        {/* Concurrency / Max Workers */}
        <div className="p-4 border border-border bg-card">
          <div className="flex justify-between items-center mb-4">
            <label className="text-xs text-muted-foreground">Max Workers</label>
            <span className="text-xs font-mono text-foreground">{settings.concurrency}</span>
          </div>
          <div className="flex items-center justify-between">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => updateSettings({ concurrency: Math.max(1, settings.concurrency - 1) })}
                  className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
              </TooltipTrigger>
              <TooltipContent>Decrease workers</TooltipContent>
            </Tooltip>
            <div className="flex-1 flex items-center justify-center">
              <div className="flex gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className={`w-2 h-2 ${i < settings.concurrency ? "bg-primary" : "bg-border"}`} />
                ))}
              </div>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => updateSettings({ concurrency: Math.min(10, settings.concurrency + 1) })}
                  className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
              </TooltipTrigger>
              <TooltipContent>Increase workers</TooltipContent>
            </Tooltip>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Parallel requests</p>
          {settings.concurrency > 1 && (
            <div className="mt-3 p-2 bg-amber-500/10 border border-amber-500/30 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-500">
                Multiple workers may cause rate limiting with free API. Use only with paid API.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
