"use client"

import { useState } from "react"
import { FileSpreadsheet, FileJson, ChevronDown, Download, HelpCircle } from "lucide-react"
import { useStore } from "@/lib/store"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

type CSVPreset = "adobe_stock" | "shutterstock" | "freepik"

interface PresetConfig {
  name: string
  description: string
  headers: string[]
  getRow: (item: { file: File; metadata: { title?: string; keywords?: string[]; category?: string; titleLength?: number } | null }) => string[]
  filename: string
  delimiter: string // CSV delimiter (comma for most, semicolon for Freepik)
  note?: string // Additional note about the format
}

const CSV_PRESETS: Record<CSVPreset, PresetConfig> = {
  adobe_stock: {
    name: "Adobe Stock",
    description: "Filename, Title, Keywords, Category, Title Length",
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
    description: "Filename, Description, Keywords, Categories, Illustration, Mature Content, Editorial",
    headers: ["Filename", "Description", "Keywords", "Categories", "Illustration", "Mature Content", "Editorial"],
    getRow: (item) => {
      const shutterstockCategory = mapToShutterstockCategory(item.metadata?.category || "")
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
    description: "Filename;Title;Keywords (semicolon-separated columns)",
    headers: ["Filename", "Title", "Keywords"],
    getRow: (item) => {
      // Freepik: Title should be 35-100 characters, truncate if needed
      let title = item.metadata?.title || ""
      if (title.length > 100) {
        title = title.slice(0, 97) + "..."
      }
      return [
        item.file.name,
        title,
        item.metadata?.keywords?.join(",") || "", // Keywords are comma-separated within the field
      ]
    },
    filename: "freepik_metadata.csv",
    delimiter: ";", // Freepik uses semicolon as delimiter
    note: "Uses semicolon (;) as column separator",
  },
}

// Map Adobe Stock categories to Shutterstock categories
function mapToShutterstockCategory(adobeCategory: string): string {
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
  return categoryMap[adobeCategory] || "Miscellaneous"
}

export function ExportSection() {
  const { queue, getStats } = useStore()
  const stats = getStats()
  const [selectedPreset, setSelectedPreset] = useState<CSVPreset>("adobe_stock")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const exportData = (format: "csv" | "json") => {
    const completedItems = queue.filter((item) => item.status === "completed" && item.metadata)

    if (completedItems.length === 0) {
      alert("No completed items to export")
      return
    }

    if (format === "json") {
      const data = completedItems.map((item) => ({
        filename: item.file.name,
        title: item.metadata?.title,
        keywords: item.metadata?.keywords,
        category: item.metadata?.category,
        titleLength: item.metadata?.titleLength,
      }))
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      })
      downloadBlob(blob, "metadata.json")
    } else {
      const preset = CSV_PRESETS[selectedPreset]
      const delimiter = preset.delimiter

      // Use appropriate escape function based on delimiter
      const escape = (str: string) => escapeCSV(str, delimiter)

      const rows = completedItems.map((item) => preset.getRow(item).map(escape))
      const csv = [preset.headers.map(escape), ...rows].map((row) => row.join(delimiter)).join("\n")
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
      downloadBlob(blob, preset.filename)
    }
  }

  const escapeCSV = (str: string, delimiter: string) => {
    // Check if string contains delimiter, quotes, or newlines
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

  if (stats.completed === 0) return null

  return (
    <section className="border-t border-border pt-6">
      <div className="flex flex-col gap-4 bg-primary p-5">
        {/* Header row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium text-primary-foreground">
              {stats.completed} image{stats.completed !== 1 ? "s" : ""} ready
            </h3>
            <p className="text-xs text-primary-foreground/70 mt-0.5">
              {stats.optimalTitles} optimal titles ({stats.avgTitleLength} avg chars)
            </p>
          </div>
          <button
            onClick={() => exportData("json")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-colors"
          >
            <FileJson className="w-3.5 h-3.5" strokeWidth={1.5} />
            Export JSON
          </button>
        </div>

        {/* CSV Preset Selector */}
        <div className="border-t border-primary-foreground/20 pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-xs text-primary-foreground/70">CSV Format:</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-3 h-3 text-primary-foreground/50 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>Different stock platforms require different CSV formats</TooltipContent>
              </Tooltip>
            </div>

            <div className="relative flex-1 max-w-xs">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 text-xs bg-primary-foreground/10 border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>{CSV_PRESETS[selectedPreset].name}</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border shadow-lg z-10">
                  {(Object.keys(CSV_PRESETS) as CSVPreset[]).map((presetKey) => {
                    const preset = CSV_PRESETS[presetKey]
                    return (
                      <button
                        key={presetKey}
                        onClick={() => {
                          setSelectedPreset(presetKey)
                          setIsDropdownOpen(false)
                        }}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-secondary transition-colors ${selectedPreset === presetKey ? 'bg-secondary' : ''
                          }`}
                      >
                        <div className="font-medium text-foreground">{preset.name}</div>
                        <div className="text-muted-foreground text-[10px] mt-0.5 truncate">{preset.description}</div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <button
              onClick={() => exportData("csv")}
              className="flex items-center gap-1.5 px-4 py-2 text-xs bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-colors font-medium"
            >
              <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
              Download CSV
            </button>
          </div>

          {/* Preview info */}
          <div className="mt-3 p-2 bg-primary-foreground/5 border border-primary-foreground/10">
            <p className="text-[10px] text-primary-foreground/60">
              <span className="font-medium">Columns:</span> {CSV_PRESETS[selectedPreset].description}
            </p>
            {CSV_PRESETS[selectedPreset].note && (
              <p className="text-[10px] text-primary-foreground/50 mt-1">
                <span className="font-medium">Note:</span> {CSV_PRESETS[selectedPreset].note}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
