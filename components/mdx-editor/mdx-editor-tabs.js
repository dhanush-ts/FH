"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ForwardRefEditor } from "./forward-ref-editor"
import { Button } from "@/components/ui/button"
import { Copy } from 'lucide-react'


export function MDXEditorTabs({ markdown, onChange, className = "" }) {
  const [activeTab, setActiveTab] = useState("edit")
  
  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdown)
  }
  
  return (
    <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab} className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <TabsList>
          <TabsTrigger value="edit">MD View</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        {activeTab === "edit" && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopyMarkdown}
            className="text-green-700 border-green-200 hover:bg-green-50"
          >
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </Button>
        )}
      </div>
      
      <TabsContent value="edit" className="mt-0">
        <div className="border rounded-md p-2 min-h-[200px]">
          <ForwardRefEditor markdown={markdown} onChange={onChange} />
        </div>
      </TabsContent>
      
      <TabsContent value="preview" className="mt-0">
        <div className="border rounded-md p-4 min-h-[200px] prose prose-green max-w-none">
          <div dangerouslySetInnerHTML={{ __html: markdown }} />
        </div>
      </TabsContent>
    </Tabs>
  )
}
