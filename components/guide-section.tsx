"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Key, Upload, Sparkles, FileDown, ArrowRight } from "lucide-react"

export function GuideSection() {
    const steps = [
        {
            icon: Key,
            title: "1. Get API Key",
            description: "You need a Google Gemini API key to use this tool.",
            action: (
                <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-black uppercase text-primary hover:underline decoration-2 underline-offset-2"
                >
                    Get Key Here <ArrowRight className="ml-1 h-4 w-4" />
                </a>
            ),
        },
        {
            icon: Upload,
            title: "2. Upload Images",
            description: "Select your stock photos (JPG, PNG). We support batch processing.",
            action: <span className="text-sm font-bold text-muted-foreground">Drag & drop or click upload</span>,
        },
        {
            icon: Sparkles,
            title: "3. AI Processing",
            description: "Gemini AI analyzes each image to generate SEO titles and tags.",
            action: <span className="text-sm font-bold text-muted-foreground">Automatic & Fast</span>,
        },
        {
            icon: FileDown,
            title: "4. Export CSV",
            description: "Download the metadata CSV and upload it directly to Adobe Stock.",
            action: <span className="text-sm font-bold text-muted-foreground">Ready for Adobe Stock</span>,
        },
    ]

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-card md:col-span-2">
                <CardHeader className="border-b-4 border-border bg-muted p-6">
                    <CardTitle className="text-2xl font-black uppercase">How It Works</CardTitle>
                    <CardDescription className="font-bold text-foreground/70">
                        Follow these simple steps to generate metadata for your Adobe Stock portfolio.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid gap-8 md:grid-cols-4">
                        {steps.map((step, index) => (
                            <div key={index} className="relative flex flex-col items-start space-y-3">
                                <div className="p-3 bg-primary neo-border neo-shadow mb-2">
                                    <step.icon className="h-6 w-6 text-foreground" />
                                </div>
                                <h3 className="text-lg font-black uppercase">{step.title}</h3>
                                <p className="text-sm font-bold text-muted-foreground leading-relaxed">
                                    {step.description}
                                </p>
                                <div className="mt-auto pt-2">{step.action}</div>

                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-6 left-[calc(100%_-_1rem)] w-full h-1 bg-border -z-10" />
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-card">
                <CardHeader className="border-b-4 border-border bg-muted p-6">
                    <CardTitle className="text-xl font-black uppercase">Tips for Success</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                            <div className="h-2 w-2 mt-2 bg-primary rounded-none" />
                            <p className="text-sm font-bold text-muted-foreground">
                                <span className="text-foreground font-black">Use High Quality Images:</span> Clear images yield better AI descriptions.
                            </p>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="h-2 w-2 mt-2 bg-primary rounded-none" />
                            <p className="text-sm font-bold text-muted-foreground">
                                <span className="text-foreground font-black">Check Your Quota:</span> Free tier has limits. Use the "Max Workers" setting carefully (Default: 1).
                            </p>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="h-2 w-2 mt-2 bg-primary rounded-none" />
                            <p className="text-sm font-bold text-muted-foreground">
                                <span className="text-foreground font-black">Review Metadata:</span> Always double-check the generated titles and tags before submitting.
                            </p>
                        </li>
                    </ul>
                </CardContent>
            </Card>

            <Card className="bg-card">
                <CardHeader className="border-b-4 border-border bg-muted p-6">
                    <CardTitle className="text-xl font-black uppercase">Why Adobe Stock?</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <p className="text-sm font-bold text-muted-foreground leading-relaxed">
                        Adobe Stock is one of the largest marketplaces for creative assets. Proper metadata (titles, keywords) is crucial for:
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="bg-secondary/20 p-3 neo-border border-2">
                            <span className="block text-2xl font-black text-foreground mb-1">2x</span>
                            <span className="text-xs font-bold uppercase text-muted-foreground">Better Visibility</span>
                        </div>
                        <div className="bg-accent/20 p-3 neo-border border-2">
                            <span className="block text-2xl font-black text-foreground mb-1">$$$</span>
                            <span className="text-xs font-bold uppercase text-muted-foreground">Higher Sales</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
