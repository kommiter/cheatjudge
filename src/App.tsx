import QueryProvider from '@/contexts/QueryProvider.tsx'
import './index.css'

function InnerLayout() {
  return (
    <div className="flex h-[100vh] flex-col bg-[#F0F0F0]">
      <header className="shrink-0">
        <div className="mx-auto flex h-[48px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <img alt="logo name" src="/duke.png" className="h-8 w-auto" />
          <img alt="logo name" src="/duke.png" className="h-8 w-auto" />
          <div className="flex items-center gap-x-8">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your profile</span>
              <img
                alt="profile image"
                src="/oia-cat.png"
                className="size-8 rounded-full bg-gray-800"
              />
            </a>
          </div>
        </div>
      </header>

      {/* 3 column wrapper */}
      <div className="h-full w-full lg:flex">
        <div className="rounded-[8px] m-[4px] bg-[#ffffff] shrink-0 border-1 border-[#DEDEDE] px-4 py-6 lg:w-96">
          {/* Left column area */}PDF
          <button className="border-1" onClick={() => {}}>
            Hide
          </button>
        </div>
        {/* Right sidebar & main wrapper */}
        <div className="flex-1 h-full">
          <div className="rounded-[8px]m-[4px] bg-[#ffffff] px-4 py-6 ">
            {/* Main area */}IDE{' '}
            <button className="border-1" onClick={() => {}}>
              Hide
            </button>
          </div>

          <div className="rounded-[8px] m-[4px] bg-[#ffffff] px-4 py-6 ">
            {/* Main area */}CONSOLE/LOG
            <button className="border-1" onClick={() => {}}>
              Hide
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <QueryProvider>
      <InnerLayout />
    </QueryProvider>
  )
}

export default App
