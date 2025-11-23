import { CheckCircle2, AlertCircle, FileText, Zap } from "lucide-react"

interface StatsDisplayProps {
  stats: {
    totalProcessed: number
    optimalTitles: number
    shortTitles: number
    failed: number
  }
}

export function StatsDisplay({ stats }: StatsDisplayProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="neo-border bg-background p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-muted neo-border">
            <FileText className="h-6 w-6 text-foreground" />
          </div>
          <div>
            <p className="text-xs font-black uppercase text-muted-foreground">Processed</p>
            <p className="text-3xl font-black text-foreground">{stats.totalProcessed}</p>
          </div>
        </div>
      </div>
      <div className="neo-border bg-background p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary neo-border">
            <CheckCircle2 className="h-6 w-6 text-foreground" />
          </div>
          <div>
            <p className="text-xs font-black uppercase text-muted-foreground">Optimal</p>
            <p className="text-3xl font-black text-foreground">{stats.optimalTitles}</p>
          </div>
        </div>
      </div>
      <div className="neo-border bg-background p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary neo-border">
            <Zap className="h-6 w-6 text-foreground" />
          </div>
          <div>
            <p className="text-xs font-black uppercase text-muted-foreground">Short</p>
            <p className="text-3xl font-black text-foreground">{stats.shortTitles}</p>
          </div>
        </div>
      </div>
      <div className="neo-border bg-background p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-destructive neo-border">
            <AlertCircle className="h-6 w-6 text-destructive-foreground" />
          </div>
          <div>
            <p className="text-xs font-black uppercase text-muted-foreground">Failed</p>
            <p className="text-3xl font-black text-foreground">{stats.failed}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
