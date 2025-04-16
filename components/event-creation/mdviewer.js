// app/components/MarkdownViewerClient.tsx
'use client'

import ReactMarkdown from 'react-markdown'

export default function MarkdownViewerClient({ content }) {
  return (
    <div className="prose">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}
