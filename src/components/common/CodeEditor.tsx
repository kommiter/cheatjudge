import { useEffect, useRef, useState } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState, Prec } from '@codemirror/state'
import { cpp } from '@codemirror/lang-cpp'
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
  const [isMouseOutAlertOpen, setIsMouseOutAlertOpen] = useState(false) // 마우스 아웃 경고 상태
  const mouseOutConfirmButtonRef = useRef<HTMLButtonElement>(null) // 마우스 아웃 확인 버튼 ref

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
        // Intercept paste events
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

  // 마우스가 창을 벗어났을 때 경고를 표시하는 useEffect
  useEffect(() => {
    const handleMouseOut = (event: MouseEvent) => {
      // event.relatedTarget이 null이면 마우스가 창 밖으로 나간 것으로 간주
      if (event.relatedTarget === null && !document.hidden) {
        setIsMouseOutAlertOpen(true)
      }
    }

    // document.documentElement에 이벤트 리스너를 추가하여 전체 창을 감지
    document.documentElement.addEventListener('mouseout', handleMouseOut)

    return () => {
      document.documentElement.removeEventListener('mouseout', handleMouseOut)
    }
  }, [])

  // 마우스 아웃 경고 모달이 열릴 때 확인 버튼에 포커스를 주는 useEffect
  useEffect(() => {
    if (isMouseOutAlertOpen) {
      const timeoutId = setTimeout(() => {
        mouseOutConfirmButtonRef.current?.focus()
      }, 50) // DOM 업데이트 후 포커스를 적용하기 위해 짧은 지연 시간 사용
      return () => clearTimeout(timeoutId)
    }
  }, [isMouseOutAlertOpen])

  return (
    <>
      <div
        ref={editorRef}
        className={cn('h-full w-full overflow-auto', className)}
      />
      <AlertDialog open={isPasteAlertOpen} onOpenChange={setIsPasteAlertOpen}>
        <AlertDialogContent /* 이전 onKeyDown 핸들러 제거 */>
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
      {/* 마우스 아웃 경고 모달 */}
      <AlertDialog
        open={isMouseOutAlertOpen}
        onOpenChange={setIsMouseOutAlertOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>경고</AlertDialogTitle>
            <AlertDialogDescription>
              마우스 포인터가 화면을 벗어났습니다. 시험에 집중해주세요.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              ref={mouseOutConfirmButtonRef}
              onClick={() => setIsMouseOutAlertOpen(false)}
            >
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
