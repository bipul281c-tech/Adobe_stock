"use client"

import { Loader2, Check, AlertCircle, Clock, Pencil, Trash2 } from "lucide-react"
import { useStore } from "@/lib/store"
import type { ImageStatus } from "@/lib/types"
import { useState } from "react"
import { EditMetadataDialog } from "./edit-metadata-dialog"
import type { QueueItem } from "@/lib/types"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

const statusConfig: Record<ImageStatus, { label: string; icon: typeof Loader2; className: string }> = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "text-muted-foreground",
  },
  processing: {
    label: "Processing",
    icon: Loader2,
    className: "text-primary",
  },
  completed: {
    label: "Complete",
    icon: Check,
    className: "text-green-500",
  },
  error: {
    label: "Error",
    icon: AlertCircle,
    className: "text-destructive",
  },
}

export function QueueTable() {
  const { queue, removeFromQueue, clearCompleted } = useStore()
  const [editingItem, setEditingItem] = useState<QueueItem | null>(null)
  const completedCount = queue.filter((i) => i.status === "completed").length

  if (queue.length === 0) {
    return (
      <section>
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Queue</h2>
        <div className="border border-border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">No images in queue</p>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Queue <span className="text-foreground ml-1">{queue.length}</span>
        </h2>
        {completedCount > 0 && (
          <button
            onClick={clearCompleted}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear completed
          </button>
        )}
      </div>

      <div className="border border-border bg-card overflow-hidden">
        <table className="w-full text-left">
          <thead className="border-b border-border">
            <tr>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider font-medium text-muted-foreground w-16">
                Image
              </th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider font-medium text-muted-foreground w-28">
                Status
              </th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
                Metadata
              </th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider font-medium text-muted-foreground w-24">
                Category
              </th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider font-medium text-muted-foreground text-right w-20">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {queue.map((item) => {
              const status = statusConfig[item.status]
              const StatusIcon = status.icon
              const titleLength = item.metadata?.titleLength || 0
              const isOptimal = titleLength >= 195

              return (
                <tr key={item.id} className="group hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 bg-muted overflow-hidden">
                      {item.status === "processing" ? (
                        <div className="w-full h-full bg-muted animate-pulse" />
                      ) : (
                        <img
                          src={item.preview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs ${status.className}`}>
                      <StatusIcon
                        className={`w-3 h-3 ${item.status === "processing" ? "animate-spin" : ""}`}
                        strokeWidth={2}
                      />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {item.status === "processing" ? (
                      <div className="h-2 w-48 bg-muted animate-pulse" />
                    ) : item.metadata ? (
                      <div>
                        <p className="text-xs text-foreground truncate max-w-sm">{item.metadata.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className={`cursor-help ${isOptimal ? "text-green-500" : "text-yellow-500"}`}>{titleLength} chars</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              {isOptimal ? "Optimal length for stock platforms" : "Below 195 chars — may be too short"}
                            </TooltipContent>
                          </Tooltip>
                          {" · "}
                          {item.metadata.keywords.length} keywords
                        </p>
                      </div>
                    ) : item.error ? (
                      <p className="text-xs text-destructive">{item.error}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground truncate max-w-sm">{item.file.name}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {item.metadata?.category ? (
                      <span className="text-xs text-muted-foreground">{item.metadata.category}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground/50">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {item.status === "completed" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => setEditingItem(item)}
                              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5" strokeWidth={1.5} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Edit metadata</TooltipContent>
                        </Tooltip>
                      )}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => removeFromQueue(item.id)}
                            className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Remove from queue</TooltipContent>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {editingItem && <EditMetadataDialog item={editingItem} onClose={() => setEditingItem(null)} />}
    </section>
  )
}
