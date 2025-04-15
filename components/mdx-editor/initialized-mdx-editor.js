"use client"

import { useEffect, useState } from "react"
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
} from "@mdxeditor/editor"

// Only import this to the next file
export default function InitializedMDXEditor({
  editorRef,
  markdown,
  onChange,
  ...props
}) {
  // Use a state to track if component is mounted
  const [isMounted, setIsMounted] = useState(false)
  
  // Set mounted state after component mounts
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  // Only render the editor when the component is mounted
  if (!isMounted) {
    return (
      <div className="border border-gray-200 rounded-md p-4 h-[200px] flex items-center justify-center">
        <p className="text-gray-500">Loading editor...</p>
      </div>
    )
  }

  return (
    <MDXEditor
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
      ]}
      markdown={markdown}
      onChange={onChange}
      {...props}
      ref={editorRef}
    />
  )
}
