'use client'

import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { analyzePromptLogic } from '@/lib/ai/analyzePromptLogic'
import { useGraphStore } from '@/lib/store/graphStore'
import { cn } from '@/lib/utils'

export default function PromptInput() {
  const [prompt, setPrompt] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { setAnalysis, setIsAnalyzing, isAnalyzing } = useGraphStore()

  const handleAnalyze = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to analyze')
      return
    }

    setError(null)
    setIsAnalyzing(true)

    try {
      const analysis = await analyzePromptLogic(prompt)
      setAnalysis(analysis, prompt)
    } catch (err) {
      console.error('Analysis error:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to analyze prompt'
      )
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleAnalyze()
    }
  }

  return (
    <div className="w-full">
      <div className="glass-morphism rounded-2xl shadow-lg p-6 animate-fade-in">
        <div className="space-y-4">
          {/* Textarea */}
          <div className="relative">
            <textarea
              id="prompt-input"
              aria-label="LLM prompt input"
              aria-describedby="prompt-help"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your LLM prompt here... (⌘/Ctrl + Enter to analyze)"
              className={cn(
                'w-full min-h-[120px] p-4 rounded-xl',
                'bg-white/60 backdrop-blur-sm',
                'border border-slate-200/50',
                'focus:outline-none focus:ring-2 focus:ring-blue-400/50',
                'placeholder:text-slate-400',
                'resize-none transition-all duration-200',
                'text-slate-900 text-sm leading-relaxed'
              )}
              disabled={isAnalyzing}
              aria-invalid={!!error}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-50/80 border border-red-200 text-red-800 text-sm animate-fade-in">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <p id="prompt-help" className="text-xs text-slate-500">
              We&apos;ll analyze the structure and identify gaps in your prompt
            </p>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !prompt.trim()}
              aria-label="Analyze prompt structure"
              className={cn(
                'flex items-center gap-2 px-6 py-3 rounded-xl',
                'bg-gradient-to-r from-blue-500 to-indigo-500',
                'text-white font-medium text-sm',
                'shadow-md hover:shadow-lg',
                'transform hover:scale-105',
                'transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
              )}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analyze Structure
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
