"use client"

import dynamic from "next/dynamic"
import { forwardRef } from "react"

// This is the only place InitializedMDXEditor is imported directly.
const Editor = dynamic(() => import("./initialized-mdx-editor").then((mod) => mod.default), {
  // Make sure we turn SSR off
  ssr: false,
  loading: () => (
    <div className="border border-gray-200 rounded-md p-4 h-[200px] flex items-center justify-center">
      <p className="text-gray-500">Loading editor...</p>
    </div>
  ),
})

// This is what is imported by other components. Pre-initialized with plugins, and ready
// to accept other props, including a ref.
export const ForwardRefEditor = forwardRef(function MDXEditorWithRef(props, ref) {
  return <Editor {...props} editorRef={ref} />
})

// TS complains without the following line
ForwardRefEditor.displayName = "ForwardRefEditor"
