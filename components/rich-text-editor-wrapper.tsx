"use client"

import { useState } from "react"
import { RichTextEditor } from "@/components/rich-text-editor"

export function RichTextEditorWrapper({
  name,
  placeholder,
  initialContent = "",
}: {
  name: string
  placeholder?: string
  initialContent?: string
}) {
  const [content, setContent] = useState(initialContent)

  return (
    <>
      <input type="hidden" name={name} value={content} />
      <RichTextEditor content={content} onChange={setContent} placeholder={placeholder} />
    </>
  )
}
