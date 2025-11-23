"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Play, Square, Sparkles, ImageIcon, FileDown, Trash2, Settings, Eye, Terminal, BookOpen, ArrowRight } from "lucide-react"
import { ConfigurationSection } from "@/components/configuration-section"
import { StatsDisplay } from "@/components/stats-display"
import { LogDisplay } from "@/components/log-display"
import { ImagePreviewGrid } from "@/components/image-preview-grid"
import { QuickStats } from "@/components/quick-stats"
import { SettingsPanel } from "@/components/settings-panel"
import { CSVPreview } from "@/components/csv-preview"
import { GuideSection } from "@/components/guide-section"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ProcessedResult {
  filename: string
  title: string
  category: string
  tags: string[]
}

export default function HomePage() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stats, setStats] = useState({
    totalProcessed: 0,
    optimalTitles: 0,
    shortTitles: 0,
    failed: 0,
  })
  const [logs, setLogs] = useState<Array<{ message: string; type: "info" | "success" | "error" | "warning" }>>([])
  const [config, setConfig] = useState({
    maxWorkers: 1,
    batchSize: 500,
    apiKey: "",
    platform: "adobe",
    titleMin: 70,
    titleMax: 200,
    keywordMin: 25,
    keywordMax: 49,
  })
  const [settings, setSettings] = useState({
    autoDownload: true,
    showPreviews: true,
    highQuality: false,
    verboseLogging: false,
  })
  const [startTime, setStartTime] = useState<number>(0)
  const [processingTime, setProcessingTime] = useState<number>(0)
  const [processedResults, setProcessedResults] = useState<ProcessedResult[]>([])
  const [csvData, setCsvData] = useState<string>("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files)
      setFiles(fileArray)
      addLog(`${fileArray.length} files selected`, "info")
    }
  }

  const addLog = (message: string, type: "info" | "success" | "error" | "warning") => {
    setLogs((prev) => [...prev, { message: `[${new Date().toLocaleTimeString()}] ${message}`, type }])
  }

  const handleDownloadCSV = () => {
    if (!csvData) {
      addLog("No CSV data available to download", "error")
      return
    }

    const csvBlob = new Blob([csvData], { type: "text/csv" })
    const url = URL.createObjectURL(csvBlob)
    const a = document.createElement("a")
    a.href = url
    a.download = `metadata_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    addLog("CSV file downloaded successfully", "success")
  }

  const handleStartProcessing = async () => {
    if (files.length === 0) {
      addLog("Please select images to process", "error")
      return
    }

    if (!config.apiKey) {
      addLog("Please enter your Google AI API key", "error")
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setStartTime(Date.now())
    setProcessedResults([])
    setCsvData("")
    addLog("Starting image processing...", "info")

    const results: ProcessedResult[] = []

    try {
      const formData = new FormData()
      files.forEach((file) => formData.append("files", file))
      formData.append("maxWorkers", config.maxWorkers.toString())
      formData.append("batchSize", config.batchSize.toString())
      formData.append("apiKey", config.apiKey)
      formData.append("platform", config.platform)
      formData.append("titleMin", config.titleMin.toString())
      formData.append("titleMax", config.titleMax.toString())
      formData.append("keywordMin", config.keywordMin.toString())
      formData.append("keywordMax", config.keywordMax.toString())

      const response = await fetch("/api/process-images", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Processing failed")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split("\n").filter((line) => line.trim())

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = JSON.parse(line.slice(6))

              if (data.type === "progress") {
                setProgress(data.progress)
                setStats(data.stats)
                setProcessingTime(Math.floor((Date.now() - startTime) / 1000))
              } else if (data.type === "log") {
                if (settings.verboseLogging || data.level !== "info") {
                  addLog(data.message, data.level)
                }
              } else if (data.type === "complete") {
                const finalTime = Math.floor((Date.now() - startTime) / 1000)
                setProcessingTime(finalTime)
                setCsvData(data.csvData)

                if (data.results) {
                  setProcessedResults(data.results)
                  // Store CSV data for download
                  const blob = new Blob([data.csvData], { type: "text/csv" })
                  const url = window.URL.createObjectURL(blob)

                  // Auto download if enabled
                  if (settings.autoDownload) {
                    const a = document.createElement("a")
                    a.href = url
                    a.download = `metadata-${config.platform}-${new Date().toISOString().slice(0, 10)}.csv`
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                    addLog("CSV file downloaded automatically", "success")
                  }
                }
                addLog(`Processing complete in ${finalTime}s!`, "success")
              }
            }
          }
        }
      }
    } catch (error) {
      addLog(`Error: ${error instanceof Error ? error.message : "Unknown error"}`, "error")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleStopProcessing = () => {
    setIsProcessing(false)
    addLog("Processing stopped by user", "warning")
  }

  const clearLogs = () => {
    setLogs([])
  }

  const clearFiles = () => {
    setFiles([])
    addLog("Files cleared", "info")
  }

  const averageTitleLength =
    stats.totalProcessed > 0
      ? Math.round((stats.optimalTitles * 100 + stats.shortTitles * 50) / stats.totalProcessed)
      : 0

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="container mx-auto px-4 py-8 max-w-5xl relative z-10">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <div className="bg-primary neo-border neo-shadow-lg p-4 md:p-8 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 md:p-4 bg-background neo-border shrink-0">
                  <Sparkles className="h-8 w-8 md:h-10 md:w-10 text-foreground" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">Adobe Stock Metadata</h1>
                  <p className="text-base md:text-lg font-bold text-foreground/80 mt-1">AI-Powered SEO Generator</p>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Badge variant="outline" className="bg-background text-foreground font-bold px-4 py-2 flex-1 md:flex-none justify-center">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  {files.length} Files
                </Badge>
                {isProcessing && (
                  <Badge className="bg-accent text-foreground font-bold px-4 py-2 animate-pulse flex-1 md:flex-none justify-center">
                    Processing...
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="bg-secondary neo-border neo-shadow p-4">
            <p className="text-foreground font-bold text-center text-sm md:text-base">
              Generate SEO-optimized titles, categories, and tags for your images using Google Gemini AI
            </p>
          </div>
        </div>

        {stats.totalProcessed > 0 && (
          <div className="mb-6">
            <QuickStats stats={stats} processingTime={processingTime} averageTitleLength={averageTitleLength} />
          </div>
        )}

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="neo-border bg-muted p-1 h-auto flex-wrap justify-start gap-1">
            <TabsTrigger
              value="guide"
              className="font-black uppercase data-[state=active]:bg-primary data-[state=active]:text-foreground flex-1 md:flex-none"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Guide
            </TabsTrigger>
            <TabsTrigger
              value="upload"
              className="font-black uppercase data-[state=active]:bg-primary data-[state=active]:text-foreground flex-1 md:flex-none"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload & Process
            </TabsTrigger>
            <TabsTrigger
              value="results"
              className="font-black uppercase data-[state=active]:bg-primary data-[state=active]:text-foreground flex-1 md:flex-none"
              disabled={processedResults.length === 0}
            >
              <Eye className="h-4 w-4 mr-2" />
              Results ({processedResults.length})
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="font-black uppercase data-[state=active]:bg-primary data-[state=active]:text-foreground flex-1 md:flex-none"
            >
              <Terminal className="h-4 w-4 mr-2" />
              Activity Log
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="font-black uppercase data-[state=active]:bg-primary data-[state=active]:text-foreground flex-1 md:flex-none"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guide" className="space-y-6">
            <GuideSection />
            <div className="flex justify-center">
              <Button
                onClick={() => document.querySelector('[value="upload"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))}
                className="bg-primary text-foreground font-black uppercase h-14 text-lg px-8 neo-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              >
                Start Uploading <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <div className="space-y-6">
              <Card className="bg-card">
                <CardHeader className="border-b-4 border-border bg-muted p-4 md:p-6">
                  <CardTitle className="text-xl md:text-2xl font-black uppercase">Upload Images</CardTitle>
                  <CardDescription className="font-bold text-foreground/70">
                    Select multiple images to process
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <div className="space-y-4">
                    <div className="border-4 border-dashed border-border p-6 md:p-12 text-center neo-hover cursor-pointer bg-muted/30 relative">
                      <Input
                        id="file-upload"
                        type="file"
                        multiple
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Label htmlFor="file-upload" className="cursor-pointer w-full h-full block">
                        <Upload className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 text-foreground" />
                        <span className="text-base md:text-lg font-black text-foreground uppercase block">
                          Drop files or click to upload
                        </span>
                        <span className="text-xs md:text-sm font-bold text-muted-foreground block mt-2">
                          PNG, JPG, JPEG (Multiple files supported)
                        </span>
                      </Label>
                    </div>

                    {files.length > 0 && (
                      <>
                        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-primary neo-border gap-4">
                          <p className="text-lg font-black text-foreground uppercase">
                            {files.length} file{files.length !== 1 ? "s" : ""} selected
                          </p>
                          <Button
                            onClick={clearFiles}
                            variant="outline"
                            size="sm"
                            className="font-bold bg-background w-full sm:w-auto"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Clear
                          </Button>
                        </div>

                        {settings.showPreviews && <ImagePreviewGrid files={files} />}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              <ConfigurationSection config={config} setConfig={setConfig} />

              <Card className="bg-card">
                <CardHeader className="border-b-4 border-border bg-muted p-4 md:p-6">
                  <CardTitle className="text-xl md:text-2xl font-black uppercase">Processing Status</CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6 space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black uppercase">{isProcessing ? "Processing..." : "Ready"}</span>
                      <span className="text-3xl font-black">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-8 bg-muted neo-border overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300 flex items-center justify-center"
                        style={{ width: `${progress}%` }}
                      >
                        {progress > 10 && (
                          <span className="text-xs font-black text-foreground">{Math.round(progress)}%</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <StatsDisplay stats={stats} />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Button
                      onClick={handleStartProcessing}
                      disabled={isProcessing || files.length === 0}
                      className="bg-primary text-foreground font-black uppercase h-14 text-base sm:col-span-2"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Start
                    </Button>
                    <Button
                      onClick={handleStopProcessing}
                      disabled={!isProcessing}
                      className="bg-destructive text-destructive-foreground font-black uppercase h-14"
                    >
                      <Square className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                      onClick={clearLogs}
                      variant="outline"
                      className="font-bold uppercase bg-background"
                    >
                      Clear Logs
                    </Button>
                    <Button
                      onClick={handleDownloadCSV}
                      variant="outline"
                      className="font-bold uppercase bg-secondary"
                      disabled={!csvData}
                    >
                      <FileDown className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="h-[600px]">
            <LogDisplay logs={logs} />
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <div className="grid gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black uppercase">Processing Results</h2>
                  <p className="text-muted-foreground font-bold mt-1">Review and export your generated metadata</p>
                </div>
                <Button
                  onClick={handleDownloadCSV}
                  className="bg-primary text-foreground font-black uppercase w-full sm:w-auto"
                  disabled={!csvData}
                >
                  <FileDown className="h-5 w-5 mr-2" />
                  Download CSV
                </Button>
              </div>

              <CSVPreview data={processedResults} />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <SettingsPanel settings={settings} setSettings={setSettings} />
              <Card className="bg-card">
                <CardHeader className="border-b-4 border-border bg-muted p-4 md:p-6">
                  <CardTitle className="text-xl md:text-2xl font-black uppercase">About</CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6 space-y-4">
                  <div className="neo-border bg-background p-4">
                    <h3 className="font-black uppercase text-sm mb-2">Adobe Stock Metadata Generator</h3>
                    <p className="text-sm font-bold text-muted-foreground">
                      This tool uses Google Gemini AI to automatically generate SEO-optimized metadata for your Adobe
                      Stock images.
                    </p>
                  </div>

                  <div className="neo-border bg-background p-4">
                    <h3 className="font-black uppercase text-sm mb-2">Features</h3>
                    <ul className="text-sm font-bold text-muted-foreground space-y-1">
                      <li>• Batch processing with concurrent workers</li>
                      <li>• SEO-optimized titles (70-200 characters)</li>
                      <li>• Automatic category selection</li>
                      <li>• 25-49 relevant tags per image</li>
                      <li>• Real-time progress tracking</li>
                      <li>• CSV export for bulk upload</li>
                    </ul>
                  </div>

                  <div className="neo-border bg-primary p-4">
                    <h3 className="font-black uppercase text-sm mb-2 text-foreground">Requirements</h3>
                    <p className="text-sm font-bold text-foreground/80">
                      You need a Google AI API key from Google AI Studio to use this tool.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
