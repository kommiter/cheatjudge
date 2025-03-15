import QueryProvider from '@/contexts/QueryProvider.tsx'
import './index.css'

function InnerLayout() {
  return (
    <div className="flex h-full flex-col">
      <header className="shrink-0 bg-gray-100">
        <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
            className="h-8 w-auto"
          />
          <div className="flex items-center gap-x-8">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your profile</span>
              <img
                alt=""
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                className="size-8 rounded-full bg-gray-800"
              />
            </a>
          </div>
        </div>
      </header>

      {/* 3 column wrapper */}
      <div className="h-full mx-auto w-full grow lg:flex xl:px-2">
        <div className="shrink-0 border-1 border-gray-200 px-4 py-6 sm:px-6 lg:w-96 lg:pr-8 xl:pr-6">
          {/* Left column area */}
        </div>
        {/* Right sidebar & main wrapper */}
        <div className="flex-1">
          <div className="px-4 py-6 border-1 border-gray-200 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            {/* Main area */}
          </div>

          <div className="px-4 py-6 border-1 border-gray-200 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            {/* Main area */}
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
