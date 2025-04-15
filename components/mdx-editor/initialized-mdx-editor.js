"use client"

import { useEffect, useState } from "react"
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  tablePlugin,
  imagePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  toolbarPlugin,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  UndoRedo,
  BoldItalicUnderlineToggles,
  ListsToggle,
  BlockTypeSelect,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  InsertCodeBlock,
  CreateLink,
  Separator
} from '@mdxeditor/editor';

export default function InitializedMDXEditor({
  editorRef,
  markdown,
  onChange,
  ...props
}) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  if (!isMounted) {
    return (
      <div className="border border-gray-200 rounded-md p-4 h-[200px] flex items-center justify-center">
        <p className="text-gray-500">Loading editor...</p>
      </div>
    )
  }

  return (
    <MDXEditor
      ref={editorRef}
      markdown={markdown}
      onChange={onChange}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        linkPlugin(),
        tablePlugin(),
        imagePlugin(),
        codeBlockPlugin(),
        codeMirrorPlugin({
          codeBlockLanguages: {
            js: "JavaScript",
            css: "CSS",
            html: "HTML",
          },
        }),
        diffSourcePlugin({ viewMode: 'rich-text' }),
        toolbarPlugin({
          toolbarContents: () => (
            <DiffSourceToggleWrapper>
              <BoldItalicUnderlineToggles />
              <Separator />
              <BlockTypeSelect />
              <ListsToggle />
              <InsertImage />
              <InsertTable />
              <InsertThematicBreak />
              <InsertCodeBlock />
              <CreateLink />
              <Separator />
              <UndoRedo />
            </DiffSourceToggleWrapper>
          ),
        }),
      ]}
      {...props}
    />
  )
}
