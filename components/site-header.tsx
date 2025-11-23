"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function SiteHeader() {
    const [isOpen, setIsOpen] = useState(false)

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "#features", label: "Features" },
        { href: "#about", label: "About" },
    ]

    return (
        <header className="sticky top-0 z-50 w-full bg-background border-b-4 border-border">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between max-w-5xl">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="p-2 bg-primary neo-border group-hover:translate-x-1 group-hover:translate-y-1 transition-transform">
                        <Sparkles className="h-6 w-6 text-foreground" />
                    </div>
                    <span className="text-xl font-black uppercase tracking-tight hidden sm:inline-block">
                        Adobe Stock Metadata
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-bold uppercase hover:underline decoration-4 underline-offset-4"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Button className="neo-border neo-shadow bg-secondary text-secondary-foreground font-black uppercase">
                        Get Started
                    </Button>
                </nav>

                {/* Mobile Navigation */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon" className="neo-border">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] neo-border-l border-l-4 p-0">
                        <div className="flex flex-col h-full bg-background">
                            <div className="p-6 border-b-4 border-border bg-muted">
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-black uppercase">Menu</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsOpen(false)}
                                        className="neo-border bg-background"
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                            <div className="flex flex-col p-6 gap-6">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="text-xl font-black uppercase hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <div className="mt-auto">
                                    <Button className="w-full neo-border neo-shadow bg-secondary text-secondary-foreground font-black uppercase h-12">
                                        Get Started
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}
