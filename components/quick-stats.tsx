"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, Clock, Target, Award } from "lucide-react"

interface QuickStatsProps {
  stats: {
    totalProcessed: number
    optimalTitles: number
    shortTitles: number
    failed: number
  }
  processingTime?: number
  averageTitleLength?: number
}

export function QuickStats({ stats, processingTime = 0, averageTitleLength = 0 }: QuickStatsProps) {
  const successRate =
    stats.totalProcessed > 0 ? (((stats.optimalTitles + stats.shortTitles) / stats.totalProcessed) * 100).toFixed(1) : 0

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-primary p-6 neo-hover">
        <div className="flex items-center justify-between mb-2">
          <TrendingUp className="h-8 w-8 text-foreground" />
          <span className="text-xs font-black uppercase text-foreground/70">Success Rate</span>
        </div>
        <div className="text-4xl font-black text-foreground">{successRate}%</div>
      </Card>

      <Card className="bg-secondary p-6 neo-hover">
        <div className="flex items-center justify-between mb-2">
          <Clock className="h-8 w-8 text-foreground" />
          <span className="text-xs font-black uppercase text-foreground/70">Processing Time</span>
        </div>
        <div className="text-4xl font-black text-foreground">{formatTime(processingTime)}</div>
      </Card>

      <Card className="bg-accent p-6 neo-hover">
        <div className="flex items-center justify-between mb-2">
          <Target className="h-8 w-8 text-foreground" />
          <span className="text-xs font-black uppercase text-foreground/70">Avg. Title</span>
        </div>
        <div className="text-4xl font-black text-foreground">{averageTitleLength}</div>
      </Card>

      <Card className="bg-card p-6 neo-hover">
        <div className="flex items-center justify-between mb-2">
          <Award className="h-8 w-8 text-primary" />
          <span className="text-xs font-black uppercase text-muted-foreground">Total Files</span>
        </div>
        <div className="text-4xl font-black text-foreground">{stats.totalProcessed}</div>
      </Card>
    </div>
  )
}
