"use client"

import { useState } from "react"
import { Play, Loader2, Square, Download, ChevronDown, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"

type CSVPreset = "adobe_stock" | "shutterstock" | "freepik"

interface PresetConfig {
  name: string
  headers: string[]
  getRow: (item: { file: File; metadata: { title?: string; keywords?: string[]; category?: string; titleLength?: number } | null }) => string[]
  filename: string
  delimiter: string
}

const CSV_PRESETS: Record<CSVPreset, PresetConfig> = {
  adobe_stock: {
    name: "Adobe Stock",
    headers: ["Filename", "Title", "Keywords", "Category", "Title Length"],
    getRow: (item) => [
      item.file.name,
      item.metadata?.title || "",
      item.metadata?.keywords?.join(",") || "",
      item.metadata?.category || "",
      item.metadata?.titleLength?.toString() || "0",
    ],
    filename: "adobe_stock_metadata.csv",
    delimiter: ",",
  },
  shutterstock: {
    name: "Shutterstock",
    headers: ["Filename", "Description", "Keywords", "Categories", "Illustration", "Mature Content", "Editorial"],
    getRow: (item) => {
      const categoryMap: Record<string, string> = {
        "Animals": "Animals/Wildlife",
        "Buildings and Architecture": "Buildings/Landmarks",
        "Business": "Business/Finance",
        "Drinks": "Food and Drink",
        "The Environment": "Nature",
        "States of Mind": "People",
        "Food": "Food and Drink",
        "Graphic Resources": "Backgrounds/Textures",
        "Hobbies and Leisure": "Parks/Outdoor",
        "Industry": "Industrial",
        "Landscape": "Nature",
        "Lifestyle": "People",
        "People": "People",
        "Plants and Flowers": "Nature",
        "Culture and Religion": "Religion",
        "Science": "Science",
        "Social Issues": "Miscellaneous",
        "Sports": "Sports/Recreation",
        "Technology": "Technology",
        "Transport": "Transportation",
        "Travel": "Parks/Outdoor",
      }
      const shutterstockCategory = categoryMap[item.metadata?.category || ""] || "Miscellaneous"
      return [
        item.file.name,
        item.metadata?.title || "",
        item.metadata?.keywords?.join(",") || "",
        shutterstockCategory,
        "No",
        "No",
        "No",
      ]
    },
    filename: "shutterstock_metadata.csv",
    delimiter: ",",
  },
  freepik: {
    name: "Freepik",
    headers: ["Filename", "Title", "Keywords"],
    getRow: (item) => {
      let title = item.metadata?.title || ""
      if (title.length > 100) {
        title = title.slice(0, 97) + "..."
      }
      return [
        item.file.name,
        title,
        item.metadata?.keywords?.join(",") || "",
      ]
    },
    filename: "freepik_metadata.csv",
    delimiter: ";",
  },
}

interface HeaderProps {
  onStartProcessing: () => void
  onStopProcessing: () => void
}

export function Header({ onStartProcessing, onStopProcessing }: HeaderProps) {
  const { queue, isProcessing, apiConfig } = useStore()
  const pendingCount = queue.filter((i) => i.status === "pending").length
  const completedCount = queue.filter((i) => i.status === "completed" && i.metadata).length
  const hasApiKey = !!apiConfig.apiKey
  const [selectedPreset, setSelectedPreset] = useState<CSVPreset>("adobe_stock")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const escapeCSV = (str: string, delimiter: string) => {
    if (str.includes(delimiter) || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return `"${str}"`
  }

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportCSV = () => {
    const completedItems = queue.filter((item) => item.status === "completed" && item.metadata)

    if (completedItems.length === 0) {
      alert("No completed items to export")
      return
    }

    const preset = CSV_PRESETS[selectedPreset]
    const delimiter = preset.delimiter
    const escape = (str: string) => escapeCSV(str, delimiter)

    const rows = completedItems.map((item) => preset.getRow(item).map(escape))
    const csv = [preset.headers.map(escape), ...rows].map((row) => row.join(delimiter)).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
    downloadBlob(blob, preset.filename)
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background sticky top-0 z-10">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-sm font-medium tracking-tight text-foreground">Batch Processing</h1>
        <p className="text-xs text-muted-foreground">
          {hasApiKey ? "Using Gemini" : "Configure API key to start"}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Download Section - only show when there are completed items */}
        {completedCount > 0 && (
          <div className="flex items-center gap-1">
            {/* Preset Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1.5 px-2 py-1.5 h-8 text-xs bg-secondary border border-border text-foreground hover:bg-secondary/80 transition-colors rounded-sm"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span className="hidden sm:inline">{CSV_PRESETS[selectedPreset].name}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 w-40 bg-background border border-border shadow-lg z-20 rounded-sm">
                  {(Object.keys(CSV_PRESETS) as CSVPreset[]).map((presetKey) => {
                    const preset = CSV_PRESETS[presetKey]
                    return (
                      <button
                        key={presetKey}
                        onClick={() => {
                          setSelectedPreset(presetKey)
                          setIsDropdownOpen(false)
                        }}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-secondary transition-colors ${selectedPreset === presetKey ? 'bg-secondary' : ''}`}
                      >
                        <div className="font-medium text-foreground">{preset.name}</div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Download Button */}
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1.5 text-xs h-8 px-3 rounded-sm"
              onClick={exportCSV}
            >
              <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span className="hidden sm:inline">Download</span> ({completedCount})
            </Button>
          </div>
        )}

        {/* Divider when both sections are visible */}
        {completedCount > 0 && <div className="h-6 w-px bg-border mx-1" />}

        {isProcessing && (
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-2 text-xs h-8 px-4 rounded-sm bg-transparent"
            onClick={onStopProcessing}
          >
            <Square className="w-3 h-3 fill-current" strokeWidth={1.5} />
            Stop
          </Button>
        )}
        <Button
          size="sm"
          className="flex items-center gap-2 text-xs h-8 px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm"
          onClick={onStartProcessing}
          disabled={isProcessing || pendingCount === 0 || !hasApiKey}
        >
          {isProcessing ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={1.5} />
          ) : (
            <Play className="w-3.5 h-3.5" strokeWidth={1.5} />
          )}
          {isProcessing ? `Processing...` : `Start (${pendingCount})`}
        </Button>
      </div>
    </header>
  )
}
