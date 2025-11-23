import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Terminal } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogDisplayProps {
  logs: Array<{ message: string; type: "info" | "success" | "error" | "warning" }>
}

export function LogDisplay({ logs }: LogDisplayProps) {
  return (
    <Card className="bg-card h-full sticky top-8">
      <CardHeader className="border-b-4 border-border bg-muted">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent neo-border">
            <Terminal className="h-6 w-6 text-foreground" />
          </div>
          <CardTitle className="text-2xl font-black uppercase">Activity Log</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ScrollArea className="h-[700px] neo-border bg-background p-4">
          <div className="space-y-1 font-mono text-sm font-bold">
            {logs.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-muted-foreground uppercase text-xs font-black">No activity yet</p>
              </div>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  className={cn(
                    "leading-relaxed px-2 py-1 border-l-4",
                    log.type === "success" && "border-primary bg-primary/10",
                    log.type === "error" && "border-destructive bg-destructive/10",
                    log.type === "warning" && "border-secondary bg-secondary/10",
                    log.type === "info" && "border-accent bg-accent/10",
                  )}
                >
                  {log.message}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
