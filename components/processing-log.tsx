"use client"

import { useStore } from "@/lib/store"
import { Trash2 } from "lucide-react"
import { useEffect, useRef } from "react"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

export function ProcessingLog() {
  const { logs, clearLogs, getStats } = useStore()
  const scrollRef = useRef<HTMLDivElement>(null)
  const stats = getStats()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  if (logs.length === 0) return null

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Processing Log</h2>
        <button
          onClick={clearLogs}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          Clear
        </button>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-4 text-xs mb-3 p-3 bg-card border border-border">
        <span className="text-muted-foreground">
          Processed: <span className="text-foreground font-mono">{stats.completed}</span>
        </span>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-muted-foreground cursor-help">
              Optimal: <span className="text-green-500 font-mono">{stats.optimalTitles}</span>
            </span>
          </TooltipTrigger>
          <TooltipContent>Titles with ≥195 characters</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-muted-foreground cursor-help">
              Short: <span className="text-yellow-500 font-mono">{stats.shortTitles}</span>
            </span>
          </TooltipTrigger>
          <TooltipContent>Titles under 195 characters</TooltipContent>
        </Tooltip>
        <span className="text-muted-foreground">
          Failed: <span className="text-red-500 font-mono">{stats.errors}</span>
        </span>
        <span className="text-muted-foreground">
          Avg Length: <span className="text-foreground font-mono">{stats.avgTitleLength}</span>
        </span>
      </div>

      {/* Log Output */}
      <div
        ref={scrollRef}
        className="h-48 overflow-y-auto bg-card border border-border p-3 font-mono text-xs space-y-1"
      >
        {logs.map((log, i) => (
          <div
            key={i}
            className={`${log.type === "success"
              ? "text-green-500"
              : log.type === "error"
                ? "text-red-500"
                : log.type === "warning"
                  ? "text-yellow-500"
                  : "text-muted-foreground"
              }`}
          >
            <span className="opacity-50">[{log.timestamp.toLocaleTimeString()}]</span> {log.message}
          </div>
        ))}
      </div>
    </section>
  )
}
