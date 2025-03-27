import { useEffect, useRef, useState } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { cpp } from '@codemirror/lang-cpp'
import { cn } from '@/lib/utils.ts'

interface CodeEditorProps {
  initialCode?: string
  onChange?: (code: string) => void
  className?: string
}

export function CodeEditor({
  initialCode = '',
  onChange,
  className = '',
}: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [, setEditorView] = useState<EditorView | null>(null)

  useEffect(() => {
    if (!editorRef.current) return

    // 에디터 설정
    const startState = EditorState.create({
      doc: initialCode,
      extensions: [
        basicSetup,
        cpp(),
        EditorView.updateListener.of((update) => {
          if (update.docChanged && onChange) {
            onChange(update.state.doc.toString())
          }
        }),
      ],
    })

    // 에디터 생성
    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    })

    setEditorView(view)

    return () => {
      view.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={editorRef}
      className={cn('h-full w-full overflow-auto', className)}
    />
  )
}
