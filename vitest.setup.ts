import '@testing-library/jest-dom'

// DataTransfer polyfill for vitest
class MockDataTransfer {
  private data: Map<string, string> = new Map()

  setData(format: string, data: string): void {
    this.data.set(format, data)
  }

  getData(format: string): string {
    return this.data.get(format) || ''
  }

  clearData(format?: string): void {
    if (format) {
      this.data.delete(format)
    } else {
      this.data.clear()
    }
  }

  get types(): string[] {
    return Array.from(this.data.keys())
  }
}

// ClipboardEvent polyfill for vitest
class MockClipboardEvent extends Event {
  clipboardData: DataTransfer | null

  constructor(type: string, eventInitDict?: ClipboardEventInit) {
    super(type, eventInitDict)
    this.clipboardData = eventInitDict?.clipboardData || null
  }
}

// Make DataTransfer and ClipboardEvent available globally
global.DataTransfer = MockDataTransfer as unknown as typeof DataTransfer
global.ClipboardEvent = MockClipboardEvent as unknown as typeof ClipboardEvent
