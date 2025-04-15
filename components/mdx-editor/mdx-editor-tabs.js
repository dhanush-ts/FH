"use client"

import { ForwardRefEditor } from "./forward-ref-editor"

export function MDXEditorTabs({ markdown, onChange, className = "" }) {

  return (
    <div className={`w-full ${className}`}>

      <div className="border rounded-md p-2 min-h-[200px]">
        <ForwardRefEditor markdown={markdown} onChange={onChange} />
      </div>
    </div>
  )
}
