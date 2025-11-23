import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react"

export function SiteFooter() {
    return (
        <footer className="bg-muted border-t-4 border-border mt-auto">
            <div className="container mx-auto px-4 py-12 max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="md:col-span-2 space-y-4">
                        <h3 className="text-2xl font-black uppercase">Adobe Stock Metadata</h3>
                        <p className="text-sm font-bold text-muted-foreground max-w-md">
                            AI-powered tool to generate SEO-optimized titles, categories, and tags for your stock photography portfolio.
                            Boost your visibility and sales with better metadata.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-lg font-black uppercase">Product</h4>
                        <ul className="space-y-2 text-sm font-bold">
                            <li><Link href="#" className="hover:underline decoration-2">Features</Link></li>
                            <li><Link href="#" className="hover:underline decoration-2">API</Link></li>
                            <li><Link href="#" className="hover:underline decoration-2">Changelog</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-lg font-black uppercase">Legal</h4>
                        <ul className="space-y-2 text-sm font-bold">
                            <li><Link href="#" className="hover:underline decoration-2">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:underline decoration-2">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:underline decoration-2">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t-4 border-border flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm font-bold text-muted-foreground">
                        © {new Date().getFullYear()} Adobe Stock Metadata. All rights reserved.
                    </p>

                    <div className="flex items-center gap-4">
                        <Link href="#" className="p-2 bg-background neo-border hover:bg-primary transition-colors">
                            <Github className="h-5 w-5" />
                        </Link>
                        <Link href="#" className="p-2 bg-background neo-border hover:bg-secondary transition-colors">
                            <Twitter className="h-5 w-5" />
                        </Link>
                        <Link href="#" className="p-2 bg-background neo-border hover:bg-accent transition-colors">
                            <Linkedin className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
