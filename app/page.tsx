"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { APIConfig } from "@/components/api-config"
import { AISettings } from "@/components/ai-settings"
import { UploadZone } from "@/components/upload-zone"
import { QueueTable } from "@/components/queue-table"
import { ProcessingLog } from "@/components/processing-log"
import { ExportSection } from "@/components/export-section"
import { useProcessQueue } from "@/hooks/use-process-queue"

export default function Home() {
  const { processQueue, stopProcessing } = useProcessQueue()

  return (
    <div className="h-screen overflow-hidden flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-background">
        <Header onStartProcessing={processQueue} onStopProcessing={stopProcessing} />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-5xl mx-auto space-y-8">
            <APIConfig />
            <AISettings />
            <UploadZone />
            <QueueTable />
            <ProcessingLog />
            <ExportSection />
          </div>
        </div>
      </main>
    </div>
  )
}
