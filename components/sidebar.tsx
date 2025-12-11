"use client"

import { useState } from "react"
import { LayoutGrid, UploadCloud, Wand2, FileSpreadsheet, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: LayoutGrid, label: "Dashboard", href: "#", active: true, disabled: false },
  { icon: UploadCloud, label: "Batch Upload", href: "#", active: false, disabled: true },
  { icon: Wand2, label: "AI Config", href: "#", active: false, disabled: true },
  { icon: FileSpreadsheet, label: "Exports", href: "#", active: false, disabled: true },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  const SidebarContent = () => (
    <>
      <div>
        <div className="flex items-center gap-2.5 px-3 mb-8">
          <div className="w-7 h-7 bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-semibold text-xs tracking-tight">M</span>
          </div>
          <span className="text-sm font-medium tracking-tight text-foreground">MetaStudio</span>
        </div>

        <nav className="space-y-0.5">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.disabled ? undefined : item.href}
              onClick={(e) => {
                if (item.disabled) {
                  e.preventDefault()
                } else {
                  setIsOpen(false)
                }
              }}
              className={cn(
                "flex items-center justify-between px-3 py-2 text-sm transition-colors",
                item.active
                  ? "text-primary bg-sidebar-accent"
                  : item.disabled
                    ? "text-muted-foreground/50 cursor-not-allowed opacity-60"
                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50",
              )}
            >
              <div className="flex items-center gap-2.5">
                <item.icon className="w-4 h-4" strokeWidth={1.5} />
                {item.label}
              </div>
              {item.disabled && (
                <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 bg-muted text-muted-foreground rounded">
                  Soon
                </span>
              )}
            </a>
          ))}
        </nav>
      </div>

      <div className="px-3 pt-4 border-t border-border">
        <div className="flex items-center justify-center">
          <span className="text-xs font-medium uppercase tracking-wider px-3 py-1.5 bg-emerald-500 text-black rounded">
            Credit System Coming Soon
          </span>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-sidebar border border-border rounded-md"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "md:hidden fixed top-0 left-0 h-full w-64 bg-sidebar border-r border-border z-50 flex flex-col justify-between py-6 px-3 transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-foreground"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 border-r border-border bg-sidebar h-full justify-between py-6 px-3">
        <SidebarContent />
      </aside>
    </>
  )
}
