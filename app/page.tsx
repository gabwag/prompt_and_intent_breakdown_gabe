import InfiniteCanvas from '@/components/canvas/InfiniteCanvas'
import PromptInput from '@/components/ui/PromptInput'

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-slate-50">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-slate-900">
            Cognitive Canvas
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Visualize your prompt&apos;s thought structure
          </p>
        </div>
      </header>

      {/* Prompt Input */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 w-full max-w-3xl px-6">
        <PromptInput />
      </div>

      {/* Infinite Canvas */}
      <InfiniteCanvas />
    </main>
  )
}
