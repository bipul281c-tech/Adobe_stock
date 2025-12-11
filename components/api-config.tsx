"use client"

import { useState } from "react"
import { Eye, EyeOff, Key, Check } from "lucide-react"
import { useStore } from "@/lib/store"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

export function APIConfig() {
  const { apiConfig, setApiConfig } = useStore()
  const [showKey, setShowKey] = useState(false)
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle")

  const testConnection = async () => {
    if (!apiConfig.apiKey) return

    setTestStatus("testing")
    try {
      // Simple validation - just check if key format looks valid
      if (apiConfig.apiKey.length > 20) {
        setTestStatus("success")
      } else {
        setTestStatus("error")
      }
    } catch {
      setTestStatus("error")
    }

    setTimeout(() => setTestStatus("idle"), 3000)
  }

  return (
    <section>
      <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">API Configuration</h2>

      <div className="border border-border bg-card p-4 space-y-4">
        {/* API Key Input */}
        <div>
          <label className="text-xs text-muted-foreground block mb-2">
            Gemini API Key
          </label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type={showKey ? "text" : "password"}
                value={apiConfig.apiKey}
                onChange={(e) => setApiConfig({ apiKey: e.target.value })}
                placeholder="AIza..."
                className="w-full pl-10 pr-10 py-2 bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </TooltipTrigger>
                <TooltipContent>{showKey ? "Hide API key" : "Show API key"}</TooltipContent>
              </Tooltip>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={testConnection}
                  disabled={!apiConfig.apiKey || testStatus === "testing"}
                  className={`px-4 py-2 text-xs font-medium border transition-colors disabled:opacity-50 ${testStatus === "success"
                    ? "border-green-500 bg-green-500/10 text-green-500"
                    : testStatus === "error"
                      ? "border-red-500 bg-red-500/10 text-red-500"
                      : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                >
                  {testStatus === "testing" ? (
                    "Testing..."
                  ) : testStatus === "success" ? (
                    <span className="flex items-center gap-1">
                      <Check className="w-3 h-3" /> Valid
                    </span>
                  ) : testStatus === "error" ? (
                    "Invalid"
                  ) : (
                    "Test"
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>Validate API key format</TooltipContent>
            </Tooltip>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Get your API key from{" "}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google AI Studio
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
