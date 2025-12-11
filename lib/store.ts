"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { QueueItem, AISettings, ProcessingStats, APIConfig, AIProvider } from "./types"

interface StoreState {
  queue: QueueItem[]
  settings: AISettings
  apiConfig: APIConfig
  isProcessing: boolean
  logs: { message: string; type: "info" | "success" | "error" | "warning"; timestamp: Date }[]
  addToQueue: (items: QueueItem[]) => void
  removeFromQueue: (id: string) => void
  updateQueueItem: (id: string, updates: Partial<QueueItem>) => void
  clearQueue: () => void
  clearCompleted: () => void
  updateSettings: (settings: Partial<AISettings>) => void
  setApiConfig: (config: Partial<APIConfig>) => void
  setIsProcessing: (isProcessing: boolean) => void
  addLog: (message: string, type?: "info" | "success" | "error" | "warning") => void
  clearLogs: () => void
  getStats: () => ProcessingStats
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      queue: [],
      settings: {
        titleLengthTarget: 200,
        keywordsCount: 49,
        concurrency: 1,
        batchSize: 50,
      },
      apiConfig: {
        provider: "gemini" as AIProvider,
        apiKey: "",
      },
      isProcessing: false,
      logs: [],

      addToQueue: (items) =>
        set((state) => ({
          queue: [...state.queue, ...items],
        })),

      removeFromQueue: (id) =>
        set((state) => ({
          queue: state.queue.filter((item) => item.id !== id),
        })),

      updateQueueItem: (id, updates) =>
        set((state) => ({
          queue: state.queue.map((item) => (item.id === id ? { ...item, ...updates } : item)),
        })),

      clearQueue: () => set({ queue: [] }),

      clearCompleted: () =>
        set((state) => ({
          queue: state.queue.filter((item) => item.status !== "completed"),
        })),

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      setApiConfig: (config) =>
        set((state) => ({
          apiConfig: { ...state.apiConfig, ...config },
        })),

      setIsProcessing: (isProcessing) => set({ isProcessing }),

      addLog: (message, type = "info") =>
        set((state) => ({
          logs: [...state.logs, { message, type, timestamp: new Date() }].slice(-100),
        })),

      clearLogs: () => set({ logs: [] }),

      getStats: () => {
        const queue = get().queue
        const completed = queue.filter((i) => i.status === "completed")
        const titlesWithLength = completed.filter((i) => i.metadata?.titleLength)
        const totalTitleLength = titlesWithLength.reduce((sum, i) => sum + (i.metadata?.titleLength || 0), 0)

        return {
          total: queue.length,
          completed: completed.length,
          processing: queue.filter((i) => i.status === "processing").length,
          pending: queue.filter((i) => i.status === "pending").length,
          errors: queue.filter((i) => i.status === "error").length,
          optimalTitles: completed.filter((i) => (i.metadata?.titleLength || 0) >= 195).length,
          shortTitles: completed.filter((i) => (i.metadata?.titleLength || 0) < 195).length,
          avgTitleLength: titlesWithLength.length > 0 ? Math.round(totalTitleLength / titlesWithLength.length) : 0,
        }
      },
    }),
    {
      name: "metadata-studio-storage",
      partialize: (state) => ({
        settings: state.settings,
        apiConfig: state.apiConfig,
      }),
    },
  ),
)
