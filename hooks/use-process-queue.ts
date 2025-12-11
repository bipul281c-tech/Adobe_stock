"use client"

import { useCallback } from "react"
import { useStore } from "@/lib/store"

export function useProcessQueue() {
  const { queue, settings, apiConfig, updateQueueItem, setIsProcessing, addLog } = useStore()

  const processImage = useCallback(
    async (itemId: string) => {
      const item = queue.find((i) => i.id === itemId)
      if (!item) return

      updateQueueItem(itemId, { status: "processing" })

      try {
        const formData = new FormData()
        formData.append("image", item.file)
        formData.append("apiKey", apiConfig.apiKey)
        formData.append("provider", apiConfig.provider)
        formData.append("keywordsCount", settings.keywordsCount.toString())

        const response = await fetch("/api/analyze-image", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Failed to analyze image")
        }

        const metadata = await response.json()

        updateQueueItem(itemId, {
          status: "completed",
          metadata,
        })

        const titleStatus = metadata.titleLength >= 195 ? "optimal" : "short"
        addLog(`✓ ${item.file.name} (${metadata.titleLength} chars, ${titleStatus})`, "success")
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error"
        updateQueueItem(itemId, {
          status: "error",
          error: message,
        })
        addLog(`✗ ${item.file.name}: ${message}`, "error")
      }
    },
    [queue, settings, apiConfig, updateQueueItem, addLog],
  )

  const processQueue = useCallback(async () => {
    const pendingItems = queue.filter((item) => item.status === "pending")
    if (pendingItems.length === 0) {
      addLog("No pending items to process", "warning")
      return
    }

    if (!apiConfig.apiKey) {
      addLog("Please configure your API key first", "error")
      return
    }

    setIsProcessing(true)
    addLog(`Starting processing of ${pendingItems.length} images...`, "info")
    addLog(`Provider: Google Gemini`, "info")
    addLog(`Max workers: ${settings.concurrency}`, "info")

    // Process in batches based on concurrency setting
    const batchSize = settings.concurrency
    for (let i = 0; i < pendingItems.length; i += batchSize) {
      const batch = pendingItems.slice(i, i + batchSize)
      addLog(`Processing batch ${Math.floor(i / batchSize) + 1}...`, "info")
      await Promise.all(batch.map((item) => processImage(item.id)))
    }

    addLog("Processing complete!", "success")
    setIsProcessing(false)
  }, [queue, settings.concurrency, apiConfig, processImage, setIsProcessing, addLog])

  const stopProcessing = useCallback(() => {
    setIsProcessing(false)
    addLog("Processing stopped by user", "warning")
  }, [setIsProcessing, addLog])

  return { processQueue, processImage, stopProcessing }
}
