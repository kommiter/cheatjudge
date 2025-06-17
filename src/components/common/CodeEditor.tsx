import { useEffect, useRef, useState } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState, Prec } from '@codemirror/state'
import { cpp } from '@codemirror/lang-cpp'
import { oneDark } from '@codemirror/theme-one-dark'
import { autocompletion } from '@codemirror/autocomplete'
import { cn } from '@/lib/utils.ts'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface CodeEditorProps {
  initialCode?: string
  onChange?: (code: string) => void
  className?: string
}

const internalClipboardType = 'application/x-cheatos-internal-code'

export function CodeEditor({
  initialCode = '',
  onChange,
  className = '',
}: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [, setEditorView] = useState<EditorView | null>(null)
  const [isPasteAlertOpen, setIsPasteAlertOpen] = useState(false)
  const confirmButtonRef = useRef<HTMLButtonElement>(null) // 확인 버튼을 위한 ref 추가

  useEffect(() => {
    if (!editorRef.current) return

    // 에디터 설정
    const startState = EditorState.create({
      doc: initialCode,
      extensions: [
        basicSetup,
        cpp(),
        oneDark,
        autocompletion(),
        EditorView.updateListener.of((update) => {
          if (update.docChanged && onChange) {
            onChange(update.state.doc.toString())
          }
        }),
        // Intercept paste events and handle Tab key
        Prec.highest(
          EditorView.domEventHandlers({
            copy(event, view) {
              const selection = view.state.sliceDoc(
                view.state.selection.main.from,
                view.state.selection.main.to,
              )
              if (selection && event.clipboardData) {
                event.clipboardData.setData(internalClipboardType, 'true')
                event.clipboardData.setData('text/plain', selection)
                toast.info('코드가 복사되었습니다.')
                event.preventDefault()
              }
            },
            paste(event) {
              if (!event.clipboardData?.types.includes(internalClipboardType)) {
                event.preventDefault()
                setIsPasteAlertOpen(true)
              } else {
                // Allow paste if it's internal, let CodeMirror handle it
              }
            },
            keydown(event, view) {
              if (event.key === 'Tab') {
                event.preventDefault()
                const { from, to } = view.state.selection.main
                const spaces = '  ' // 2칸 들여쓰기

                view.dispatch({
                  changes: { from, to, insert: spaces },
                  selection: { anchor: from + spaces.length },
                })
                return true
              }
              return false
            },
          }),
        ),
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

  // 모달이 열릴 때 확인 버튼에 포커스를 주는 useEffect 추가
  useEffect(() => {
    if (isPasteAlertOpen) {
      const timeoutId = setTimeout(() => {
        confirmButtonRef.current?.focus()
      }, 50) // DOM 업데이트 후 포커스를 적용하기 위해 짧은 지연 시간 사용
      return () => clearTimeout(timeoutId)
    }
  }, [isPasteAlertOpen])

  return (
    <>
      <div
        ref={editorRef}
        className={cn('h-full w-full overflow-auto', className)}
      />
      <AlertDialog open={isPasteAlertOpen} onOpenChange={setIsPasteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>부정행위 감지</AlertDialogTitle>
            <AlertDialogDescription>
              외부에서 복사한 내용은 코드 에디터에 붙여넣을 수 없습니다. 이
              페이지 내부에서 복사한 내용만 붙여넣기 할 수 있습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              ref={confirmButtonRef} // ref 할당
              onClick={() => setIsPasteAlertOpen(false)}
            >
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
