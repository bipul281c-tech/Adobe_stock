"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileSpreadsheet } from "lucide-react"

interface CSVPreviewProps {
  data: Array<{
    filename: string
    title: string
    category: string
    tags: string[]
  }>
}

export function CSVPreview({ data }: CSVPreviewProps) {
  return (
    <Card className="bg-card">
      <CardHeader className="border-b-4 border-border bg-muted">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent neo-border">
            <FileSpreadsheet className="h-6 w-6 text-foreground" />
          </div>
          <CardTitle className="text-2xl font-black uppercase">CSV Preview</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ScrollArea className="h-[400px] neo-border bg-background">
          <Table>
            <TableHeader className="bg-muted sticky top-0">
              <TableRow className="border-b-4 border-border">
                <TableHead className="font-black uppercase text-foreground">Filename</TableHead>
                <TableHead className="font-black uppercase text-foreground">Title</TableHead>
                <TableHead className="font-black uppercase text-foreground">Category</TableHead>
                <TableHead className="font-black uppercase text-foreground">Tags</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <p className="text-muted-foreground font-bold uppercase text-sm">No data to preview</p>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, index) => (
                  <TableRow key={index} className="border-b-2 border-border hover:bg-muted/50">
                    <TableCell className="font-bold text-sm">{row.filename}</TableCell>
                    <TableCell className="font-bold text-sm max-w-[300px] truncate">{row.title}</TableCell>
                    <TableCell className="font-bold text-sm">{row.category}</TableCell>
                    <TableCell className="font-bold text-sm max-w-[200px] truncate">
                      {row.tags.slice(0, 5).join(", ")}
                      {row.tags.length > 5 && "..."}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
