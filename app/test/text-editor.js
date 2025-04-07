"use client"

import React from "react"
import { useState } from "react"
import dynamic from "next/dynamic"
import { EditorState, convertToRaw } from "draft-js"
import draftToHtml from "draftjs-to-html"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

// Dynamically import the Editor to avoid SSR issues
const Editor = dynamic(() => import("react-draft-wysiwyg").then((mod) => mod.Editor), { ssr: false })

const RichTextEditor= ({
  onChange,
  initialValue,
  placeholder = "Start typing...",
  height = "300px",
  readOnly = false,
  toolbarHidden = false,
}) => {
  const [editorState, setEditorState] = useState(initialValue || EditorState.createEmpty())

  const handleEditorChange = (state) => {
    setEditorState(state)
    if (onChange) {
      const html = draftToHtml(convertToRaw(state.getCurrentContent()))
      onChange(html)
    }
  }

  // Comprehensive toolbar options
  const toolbarOptions = {
    options: ["inline", "list", "textAlign", "link", "image", "history"],
    inline: {
      options: ["bold", "italic", "underline", "strikethrough", "monospace", "superscript", "subscript"],
    },
    list: {
      options: ["unordered", "ordered", "indent", "outdent"],
    },
    textAlign: {
      options: ["left", "center", "right", "justify"],
    },
    link: {
      inDropdown: false,
      showOpenOptionOnHover: true,
      defaultTargetOption: "_self",
      options: ["link", "unlink"],
    },
    image: {
      urlEnabled: true,
      uploadEnabled: true,
      alignmentEnabled: true,
      previewImage: true,
      inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
      alt: { present: false, mandatory: false },
      defaultSize: {
        height: "auto",
        width: "auto",
      },
    },
  }

  return (
    <div className="w-full rounded-md overflow-hidden border border-gray-200 shadow-sm">
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        wrapperClassName="w-full"
        editorClassName={`px-4 py-2 min-h-[${height}] focus:outline-none`}
        toolbarClassName="border-b border-gray-200 sticky top-0 z-10 bg-white"
        toolbar={toolbarOptions}
        placeholder={placeholder}
        readOnly={readOnly}
        toolbarHidden={toolbarHidden}
        stripPastedStyles={false}
        spellCheck
      />
    </div>
  )
}

export default RichTextEditor

