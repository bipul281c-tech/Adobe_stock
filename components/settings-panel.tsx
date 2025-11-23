"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Sliders, Zap, Shield, Download } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface SettingsPanelProps {
  settings: {
    autoDownload: boolean
    showPreviews: boolean
    highQuality: boolean
    verboseLogging: boolean
  }
  setSettings: (settings: any) => void
}

export function SettingsPanel({ settings, setSettings }: SettingsPanelProps) {
  return (
    <Card className="bg-card">
      <CardHeader className="border-b-4 border-border bg-muted">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary neo-border">
            <Sliders className="h-6 w-6 text-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-black uppercase">Advanced Settings</CardTitle>
            <CardDescription className="font-bold text-foreground/70">
              Customize your processing experience
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 neo-border bg-background">
            <div className="flex items-center gap-3">
              <Download className="h-5 w-5 text-foreground" />
              <div>
                <Label htmlFor="auto-download" className="font-black uppercase text-sm cursor-pointer">
                  Auto Download CSV
                </Label>
                <p className="text-xs text-muted-foreground font-bold">Download results automatically</p>
              </div>
            </div>
            <Switch
              id="auto-download"
              checked={settings.autoDownload}
              onCheckedChange={(checked) => setSettings({ ...settings, autoDownload: checked })}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <Separator className="bg-border h-[2px]" />

          <div className="flex items-center justify-between p-4 neo-border bg-background">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-foreground" />
              <div>
                <Label htmlFor="show-previews" className="font-black uppercase text-sm cursor-pointer">
                  Show Image Previews
                </Label>
                <p className="text-xs text-muted-foreground font-bold">Display image thumbnails</p>
              </div>
            </div>
            <Switch
              id="show-previews"
              checked={settings.showPreviews}
              onCheckedChange={(checked) => setSettings({ ...settings, showPreviews: checked })}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <Separator className="bg-border h-[2px]" />

          <div className="flex items-center justify-between p-4 neo-border bg-background">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-foreground" />
              <div>
                <Label htmlFor="high-quality" className="font-black uppercase text-sm cursor-pointer">
                  High Quality Mode
                </Label>
                <p className="text-xs text-muted-foreground font-bold">Better results, slower processing</p>
              </div>
            </div>
            <Switch
              id="high-quality"
              checked={settings.highQuality}
              onCheckedChange={(checked) => setSettings({ ...settings, highQuality: checked })}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <Separator className="bg-border h-[2px]" />

          <div className="flex items-center justify-between p-4 neo-border bg-background">
            <div className="flex items-center gap-3">
              <Sliders className="h-5 w-5 text-foreground" />
              <div>
                <Label htmlFor="verbose-logging" className="font-black uppercase text-sm cursor-pointer">
                  Verbose Logging
                </Label>
                <p className="text-xs text-muted-foreground font-bold">Show detailed debug information</p>
              </div>
            </div>
            <Switch
              id="verbose-logging"
              checked={settings.verboseLogging}
              onCheckedChange={(checked) => setSettings({ ...settings, verboseLogging: checked })}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
