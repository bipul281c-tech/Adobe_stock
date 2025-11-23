"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Key, Users, Layers, Globe, Type, Hash } from "lucide-react"

interface ConfigurationSectionProps {
  config: {
    maxWorkers: number
    batchSize: number
    apiKey: string
    platform: string
    titleMin: number
    titleMax: number
    keywordMin: number
    keywordMax: number
  }
  setConfig: (config: any) => void
}

export function ConfigurationSection({ config, setConfig }: ConfigurationSectionProps) {
  const handlePlatformChange = (value: string) => {
    let newConfig = { ...config, platform: value }

    // Set defaults based on platform
    switch (value) {
      case "adobe":
        newConfig = { ...newConfig, titleMin: 70, titleMax: 200, keywordMin: 25, keywordMax: 49 }
        break
      case "shutterstock":
        newConfig = { ...newConfig, titleMin: 20, titleMax: 200, keywordMin: 7, keywordMax: 50 }
        break
      case "freepik":
        newConfig = { ...newConfig, titleMin: 20, titleMax: 100, keywordMin: 5, keywordMax: 50 }
        break
    }
    setConfig(newConfig)
  }

  return (
    <Card className="bg-card">
      <CardHeader className="border-b-4 border-border bg-muted">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent neo-border">
            <Settings className="h-6 w-6 text-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-black uppercase">Configuration</CardTitle>
            <CardDescription className="font-bold text-foreground/70">API key and processing settings</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-foreground" />
            <Label htmlFor="api-key" className="font-black uppercase text-sm">
              Google AI API Key
            </Label>
          </div>
          <Input
            id="api-key"
            type="password"
            placeholder="Enter your API key"
            value={config.apiKey}
            onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
            className="h-12 font-bold bg-background"
          />
          <div className="bg-secondary neo-border p-3">
            <p className="text-xs font-bold text-foreground">
              Get your API key from{" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline decoration-2 hover:decoration-4"
              >
                Google AI Studio
              </a>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-foreground" />
              <Label className="font-black uppercase text-sm">Target Platform</Label>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {["adobe", "shutterstock", "freepik"].map((platform) => (
                <button
                  key={platform}
                  onClick={() => handlePlatformChange(platform)}
                  className={`
                  relative p-4 text-center neo-border transition-all
                  ${config.platform === platform
                      ? "bg-primary text-primary-foreground scale-[1.02] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      : "bg-background hover:bg-accent hover:text-accent-foreground"
                    }
                `}
                >
                  <span className="block font-black uppercase text-sm md:text-base">
                    {platform === "adobe" ? "Adobe Stock" : platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </span>
                  {config.platform === platform && (
                    <div className="absolute -top-2 -right-2 bg-foreground text-background rounded-full p-1">
                      <Settings className="h-3 w-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs font-bold text-muted-foreground">Select a platform to load recommended settings</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-foreground" />
                <Label htmlFor="max-workers" className="font-black uppercase text-sm">
                  Max Workers
                </Label>
              </div>
              <Input
                id="max-workers"
                type="number"
                min="1"
                max="100"
                value={config.maxWorkers}
                onChange={(e) => setConfig({ ...config, maxWorkers: Number.parseInt(e.target.value) || 1 })}
                className="h-12 font-bold bg-background"
              />
              <p className="text-xs font-bold text-destructive mt-1">
                ⚠️ Keep at 1 for free tier
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-foreground" />
                <Label htmlFor="batch-size" className="font-black uppercase text-sm">
                  Batch Size
                </Label>
              </div>
              <Input
                id="batch-size"
                type="number"
                min="1"
                max="1000"
                value={config.batchSize}
                onChange={(e) => setConfig({ ...config, batchSize: Number.parseInt(e.target.value) || 1 })}
                className="h-12 font-bold bg-background"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t-4 border-dashed border-border">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Type className="h-5 w-5 text-foreground" />
              <Label className="font-black uppercase text-sm">Title Length (Chars)</Label>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Min"
                  value={config.titleMin}
                  onChange={(e) => setConfig({ ...config, titleMin: Number.parseInt(e.target.value) || 0 })}
                  className="h-10 font-bold bg-background"
                />
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Min</span>
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Max"
                  value={config.titleMax}
                  onChange={(e) => setConfig({ ...config, titleMax: Number.parseInt(e.target.value) || 0 })}
                  className="h-10 font-bold bg-background"
                />
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Max</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-foreground" />
              <Label className="font-black uppercase text-sm">Keyword Count</Label>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Min"
                  value={config.keywordMin}
                  onChange={(e) => setConfig({ ...config, keywordMin: Number.parseInt(e.target.value) || 0 })}
                  className="h-10 font-bold bg-background"
                />
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Min</span>
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Max"
                  value={config.keywordMax}
                  onChange={(e) => setConfig({ ...config, keywordMax: Number.parseInt(e.target.value) || 0 })}
                  className="h-10 font-bold bg-background"
                />
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Max</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
