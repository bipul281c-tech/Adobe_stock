export type ImageStatus = "pending" | "processing" | "completed" | "error"

export interface ImageMetadata {
  title: string
  keywords: string[]
  category: string
  titleLength: number
}

export interface QueueItem {
  id: string
  file: File
  preview: string
  status: ImageStatus
  metadata: ImageMetadata | null
  error?: string
  createdAt: Date
}

export interface AISettings {
  titleLengthTarget: number
  keywordsCount: number
  concurrency: number
  batchSize: number
}

export interface ProcessingStats {
  total: number
  completed: number
  processing: number
  pending: number
  errors: number
  optimalTitles: number
  shortTitles: number
  avgTitleLength: number
}

export type AIProvider = "gemini"

export interface APIConfig {
  provider: AIProvider
  apiKey: string
}

export const ADOBE_STOCK_CATEGORIES = [
  "Animals",
  "Buildings and Architecture",
  "Business",
  "Drinks",
  "The Environment",
  "States of Mind",
  "Food",
  "Graphic Resources",
  "Hobbies and Leisure",
  "Industry",
  "Landscape",
  "Lifestyle",
  "People",
  "Plants and Flowers",
  "Culture and Religion",
  "Science",
  "Social Issues",
  "Sports",
  "Technology",
  "Transport",
  "Travel",
] as const
