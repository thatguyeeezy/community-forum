"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Heading from "@tiptap/extension-heading"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import TextAlign from "@tiptap/extension-text-align"
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  LinkIcon,
  ImageIcon,
} from "lucide-react"
import { useState } from "react"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder = "Write something..." }: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState("")
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [showImageInput, setShowImageInput] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose dark:prose-invert focus:outline-none max-w-none min-h-[200px] p-4 bg-white dark:bg-slate-800 rounded-md border border-gray-300 dark:border-gray-600",
        placeholder,
      },
    },
  })

  const addLink = () => {
    if (!linkUrl) return

    editor?.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()

    setLinkUrl("")
    setShowLinkInput(false)
  }

  const addImage = () => {
    if (!imageUrl) return

    editor?.chain().focus().setImage({ src: imageUrl }).run()

    setImageUrl("")
    setShowImageInput(false)
  }

  if (!editor) {
    return null
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-md">
      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-gray-200 dark:bg-slate-700" : ""}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-gray-200 dark:bg-slate-700" : ""}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive("heading", { level: 1 }) ? "bg-gray-200 dark:bg-slate-700" : ""}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive("heading", { level: 2 }) ? "bg-gray-200 dark:bg-slate-700" : ""}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-gray-200 dark:bg-slate-700" : ""}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-gray-200 dark:bg-slate-700" : ""}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={editor.isActive({ textAlign: "left" }) ? "bg-gray-200 dark:bg-slate-700" : ""}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={editor.isActive({ textAlign: "center" }) ? "bg-gray-200 dark:bg-slate-700" : ""}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={editor.isActive({ textAlign: "right" }) ? "bg-gray-200 dark:bg-slate-700" : ""}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowLinkInput(!showLinkInput)}
          className={editor.isActive("link") ? "bg-gray-200 dark:bg-slate-700" : ""}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setShowImageInput(!showImageInput)}>
          <ImageIcon className="h-4 w-4" />
        </Button>
      </div>

      {showLinkInput && (
        <div className="p-2 bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700 flex">
          <input
            type="text"
            placeholder="Enter URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="flex-1 px-2 py-1 text-sm bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-md"
          />
          <Button type="button" size="sm" onClick={addLink} className="ml-2">
            Add Link
          </Button>
        </div>
      )}

      {showImageInput && (
        <div className="p-2 bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700 flex">
          <input
            type="text"
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="flex-1 px-2 py-1 text-sm bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-md"
          />
          <Button type="button" size="sm" onClick={addImage} className="ml-2">
            Add Image
          </Button>
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  )
}
