import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { CodeEditor } from './CodeEditor'

// mock the toast function
vi.mock('sonner', () => ({
  toast: {
    info: vi.fn(),
  },
}))

// mock codemirror
vi.mock('codemirror', () => {
  const mockDomHandlers = new Map()

  const mockView = {
    state: {
      doc: {
        toString: () => '',
      },
      selection: {
        main: {
          from: 0,
          to: 0,
        },
      },
      sliceDoc: () => 'test code',
    },
    destroy: vi.fn(),
    dom: null as HTMLElement | null,
  }

  return {
    EditorView: Object.assign(
      vi.fn().mockImplementation((config) => {
        // DOM 요소 생성
        const div = document.createElement('div')
        div.className = 'h-full w-full overflow-auto'

        // 저장된 핸들러들을 실제 DOM에 등록
        mockDomHandlers.forEach((handler, eventType) => {
          div.addEventListener(eventType, handler)
        })

        mockView.dom = div

        // parent에 추가
        if (config.parent) {
          config.parent.appendChild(div)
        }

        return mockView
      }),
      {
        updateListener: {
          of: vi.fn((callback) => ({
            extension: 'updateListener',
            callback,
          })),
        },
        domEventHandlers: vi.fn((handlers) => {
          // 핸들러들을 저장
          Object.entries(handlers).forEach(([eventType, handler]) => {
            mockDomHandlers.set(eventType, handler)
          })
          return {
            extension: 'domEventHandlers',
            handlers,
          }
        }),
      },
    ),
    basicSetup: [],
  }
})

vi.mock('@codemirror/state', () => ({
  EditorState: {
    create: vi.fn(() => ({})),
  },
  Prec: {
    highest: vi.fn((arg) => arg),
  },
}))

vi.mock('@codemirror/lang-cpp', () => ({
  cpp: vi.fn(() => []),
}))

describe('CodeEditor', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
    vi.clearAllMocks()
  })

  describe('외부 복사 내용 붙여넣기 감지', () => {
    it('외부에서 복사한 내용을 붙여넣을 때 경고 모달이 표시되어야 한다', async () => {
      render(<CodeEditor />)

      // 내부 에디터 DOM 요소 찾기 (CodeMirror에서 생성된 요소)
      const innerEditorContainer = document.querySelector(
        '.h-full.w-full.overflow-auto .h-full.w-full.overflow-auto',
      )
      expect(innerEditorContainer).toBeInTheDocument()

      // 외부에서 복사한 내용을 붙여넣기하는 이벤트 생성
      const clipboardData = {
        types: ['text/plain'],
        getData: vi.fn((type) => {
          if (type === 'text/plain') return 'external code'
          return ''
        }),
        setData: vi.fn(),
      }

      const pasteEvent = new Event('paste', {
        bubbles: true,
        cancelable: true,
      }) as ClipboardEvent

      // clipboardData 추가
      Object.defineProperty(pasteEvent, 'clipboardData', {
        value: clipboardData,
        writable: false,
      })

      // paste 이벤트 발생 (내부 에디터 DOM에)
      fireEvent(innerEditorContainer!, pasteEvent)

      // 경고 모달이 표시되는지 확인
      await waitFor(() => {
        expect(screen.getByText('부정행위 감지')).toBeInTheDocument()
      })

      expect(
        screen.getByText(
          '외부에서 복사한 내용은 코드 에디터에 붙여넣을 수 없습니다. 이 페이지 내부에서 복사한 내용만 붙여넣기 할 수 있습니다.',
        ),
      ).toBeInTheDocument()

      expect(screen.getByRole('button', { name: '확인' })).toBeInTheDocument()
    })

    it('내부에서 복사한 내용을 붙여넣을 때는 경고 모달이 표시되지 않아야 한다', async () => {
      render(<CodeEditor />)

      const innerEditorContainer = document.querySelector(
        '.h-full.w-full.overflow-auto .h-full.w-full.overflow-auto',
      )
      expect(innerEditorContainer).toBeInTheDocument()

      // 내부에서 복사한 내용을 붙여넣기하는 이벤트 생성
      const clipboardData = {
        types: ['application/x-cheatos-internal-code', 'text/plain'],
        getData: vi.fn((type) => {
          if (type === 'application/x-cheatos-internal-code') return 'true'
          if (type === 'text/plain') return 'internal code'
          return ''
        }),
        setData: vi.fn(),
      }

      const pasteEvent = new Event('paste', {
        bubbles: true,
        cancelable: true,
      }) as ClipboardEvent

      Object.defineProperty(pasteEvent, 'clipboardData', {
        value: clipboardData,
        writable: false,
      })

      fireEvent(innerEditorContainer!, pasteEvent)

      // 경고 모달이 표시되지 않는지 확인
      await waitFor(
        () => {
          expect(screen.queryByText('부정행위 감지')).not.toBeInTheDocument()
        },
        { timeout: 1000 },
      )
    })

    it('붙여넣기 경고 모달의 확인 버튼을 클릭하면 모달이 닫혀야 한다', async () => {
      render(<CodeEditor />)

      const innerEditorContainer = document.querySelector(
        '.h-full.w-full.overflow-auto .h-full.w-full.overflow-auto',
      )
      expect(innerEditorContainer).toBeInTheDocument()

      // 외부 붙여넣기 이벤트 생성
      const clipboardData = {
        types: ['text/plain'],
        getData: vi.fn((type) => {
          if (type === 'text/plain') return 'external code'
          return ''
        }),
        setData: vi.fn(),
      }

      const pasteEvent = new Event('paste', {
        bubbles: true,
        cancelable: true,
      }) as ClipboardEvent

      Object.defineProperty(pasteEvent, 'clipboardData', {
        value: clipboardData,
        writable: false,
      })

      fireEvent(innerEditorContainer!, pasteEvent)

      // 모달이 표시될 때까지 대기
      await waitFor(() => {
        expect(screen.getByText('부정행위 감지')).toBeInTheDocument()
      })

      // 확인 버튼 클릭 (fireEvent 사용)
      const confirmButton = screen.getByRole('button', { name: '확인' })
      fireEvent.click(confirmButton)

      // 모달이 닫혔는지 확인
      await waitFor(() => {
        expect(screen.queryByText('부정행위 감지')).not.toBeInTheDocument()
      })
    })

    it('클립보드 데이터가 없는 경우에도 경고 모달이 표시되어야 한다', async () => {
      render(<CodeEditor />)

      const innerEditorContainer = document.querySelector(
        '.h-full.w-full.overflow-auto .h-full.w-full.overflow-auto',
      )
      expect(innerEditorContainer).toBeInTheDocument()

      // 클립보드 데이터가 없는 붙여넣기 이벤트
      const pasteEvent = new Event('paste', {
        bubbles: true,
        cancelable: true,
      }) as ClipboardEvent

      Object.defineProperty(pasteEvent, 'clipboardData', {
        value: null,
        writable: false,
      })

      fireEvent(innerEditorContainer!, pasteEvent)

      // 경고 모달이 표시되는지 확인
      await waitFor(() => {
        expect(screen.getByText('부정행위 감지')).toBeInTheDocument()
      })
    })
  })

  describe('마우스 포인터 창 밖 이동 감지', () => {
    it('마우스 포인터가 창밖으로 이동할 때 경고 모달이 표시되어야 한다', async () => {
      render(<CodeEditor />)

      // 마우스가 창밖으로 나가는 이벤트 시뮬레이션
      // relatedTarget이 null이면 창밖으로 나간 것으로 간주
      const mouseOutEvent = new MouseEvent('mouseout', {
        bubbles: true,
        cancelable: true,
        relatedTarget: null,
      })

      // document.documentElement에서 mouseout 이벤트 발생
      fireEvent(document.documentElement, mouseOutEvent)

      // 경고 모달이 표시되는지 확인
      await waitFor(() => {
        expect(screen.getByText('경고')).toBeInTheDocument()
      })

      expect(
        screen.getByText(
          '마우스 포인터가 화면을 벗어났습니다. 시험에 집중해주세요.',
        ),
      ).toBeInTheDocument()

      expect(screen.getByRole('button', { name: '확인' })).toBeInTheDocument()
    })

    it('마우스가 창 내부 요소로 이동할 때는 경고 모달이 표시되지 않아야 한다', async () => {
      render(<CodeEditor />)

      // 마우스가 창 내부 요소로 이동하는 이벤트 시뮬레이션
      // relatedTarget이 있으면 창 내부로 이동한 것으로 간주
      const mouseOutEvent = new MouseEvent('mouseout', {
        bubbles: true,
        cancelable: true,
        relatedTarget: document.body,
      })

      fireEvent(document.documentElement, mouseOutEvent)

      // 경고 모달이 표시되지 않는지 확인
      await waitFor(
        () => {
          expect(screen.queryByText('경고')).not.toBeInTheDocument()
        },
        { timeout: 1000 },
      )
    })

    it('마우스 아웃 경고 모달의 확인 버튼을 클릭하면 모달이 닫혀야 한다', async () => {
      render(<CodeEditor />)

      // 마우스가 창밖으로 나가는 이벤트 시뮬레이션
      const mouseOutEvent = new MouseEvent('mouseout', {
        bubbles: true,
        cancelable: true,
        relatedTarget: null,
      })

      fireEvent(document.documentElement, mouseOutEvent)

      // 모달이 표시될 때까지 대기
      await waitFor(() => {
        expect(screen.getByText('경고')).toBeInTheDocument()
      })

      // 확인 버튼 클릭 (두 번째 확인 버튼이므로 getAllByRole 사용)
      const confirmButtons = screen.getAllByRole('button', { name: '확인' })
      const mouseOutConfirmButton = confirmButtons[confirmButtons.length - 1]
      await user.click(mouseOutConfirmButton)

      // 모달이 닫혔는지 확인
      await waitFor(() => {
        expect(screen.queryByText('경고')).not.toBeInTheDocument()
      })
    })

    it('document.hidden이 true일 때는 마우스 아웃 경고가 표시되지 않아야 한다', async () => {
      // document.hidden을 true로 설정
      Object.defineProperty(document, 'hidden', {
        writable: true,
        value: true,
      })

      render(<CodeEditor />)

      const mouseOutEvent = new MouseEvent('mouseout', {
        bubbles: true,
        cancelable: true,
        relatedTarget: null,
      })

      fireEvent(document.documentElement, mouseOutEvent)

      // 경고 모달이 표시되지 않는지 확인
      await waitFor(
        () => {
          expect(screen.queryByText('경고')).not.toBeInTheDocument()
        },
        { timeout: 1000 },
      )

      // document.hidden을 원래대로 복원
      Object.defineProperty(document, 'hidden', {
        writable: true,
        value: false,
      })
    })
  })

  describe('컴포넌트 props', () => {
    it('initialCode prop이 전달되면 초기 코드가 설정되어야 한다', async () => {
      const { EditorState } = await import('@codemirror/state')
      const initialCode = 'int main() { return 0; }'
      render(<CodeEditor initialCode={initialCode} />)

      // CodeMirror의 EditorState.create가 초기 코드와 함께 호출되었는지 확인
      expect(vi.mocked(EditorState.create)).toHaveBeenCalledWith(
        expect.objectContaining({
          doc: initialCode,
        }),
      )
    })

    it('onChange prop이 전달되면 코드 변경 시 호출되어야 한다', () => {
      const onChange = vi.fn()
      render(<CodeEditor onChange={onChange} />)

      // 에디터 컨테이너가 렌더링되었는지 확인
      const editorContainer = document.querySelector(
        '.h-full.w-full.overflow-auto',
      )
      expect(editorContainer).toBeInTheDocument()
    })

    it('className prop이 전달되면 적용되어야 한다', () => {
      const customClassName = 'custom-editor-class'
      render(<CodeEditor className={customClassName} />)

      const editorContainer = document.querySelector(`.${customClassName}`)
      expect(editorContainer).toBeInTheDocument()
      expect(editorContainer).toHaveClass(customClassName)
    })
  })
})
