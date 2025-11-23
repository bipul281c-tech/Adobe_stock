"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface QueueItem {
  filename: string
  status: "pending" | "processing" | "completed" | "failed"
  progress?: number
  titleLength?: number
}

interface ProcessingQueueProps {
  items: QueueItem[]
}

export function ProcessingQueue({ items }: ProcessingQueueProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-muted-foreground" />
      case "processing":
        return <Loader2 className="h-4 w-4 text-accent animate-spin" />
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-primary" />
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "outline",
      processing: "default",
      completed: "default",
      failed: "destructive",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants]} className="neo-border font-bold uppercase text-xs">
        {status}
      </Badge>
    )
  }

  return (
    <Card className="neo-border neo-shadow bg-card">
      <CardHeader className="border-b-4 border-border bg-muted">
        <CardTitle className="text-2xl font-black uppercase">Processing Queue</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <ScrollArea className="h-[400px] neo-border bg-background p-4">
          <div className="space-y-2">
            {items.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-muted-foreground uppercase text-xs font-black">No items in queue</p>
              </div>
            ) : (
              items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 neo-border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(item.status)}
                    <span className="font-bold text-sm truncate flex-1">{item.filename}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.titleLength && (
                      <Badge variant="outline" className="neo-border font-bold text-xs">
                        {item.titleLength} chars
                      </Badge>
                    )}
                    {getStatusBadge(item.status)}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
