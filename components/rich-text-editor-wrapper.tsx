"use client"

import { useState } from "react"
import { RichTextEditor } from "@/components/rich-text-editor"

export function RichTextEditorWrapper({ name, placeholder }: { name: string; placeholder?: string }) {
  const [content, setContent] = useState("")

  return (
    <>
      <input type="hidden" name={name} value={content} />
      <RichTextEditor content={content} onChange={setContent} placeholder={placeholder} />
    </>
  )
}
