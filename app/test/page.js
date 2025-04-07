"use client"

import { useState } from "react"
import RichTextEditor from "./text-editor"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

export default function EditorDemo() {
  const [content, setContent] = useState("")
  const [showPreview, setShowPreview] = useState(true)

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Rich Text Editor</CardTitle>
          </CardHeader>
          <CardContent>
            <RichTextEditor onChange={setContent} height="400px" />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>Save Content</Button>
          </CardFooter>
        </Card>

        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Preview</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[400px] border-t border-gray-100">
            {content ? (
              <div className="prose max-w-none h-full" dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <div className="text-gray-400 italic flex items-center justify-center h-full">
                Your content preview will appear here
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

