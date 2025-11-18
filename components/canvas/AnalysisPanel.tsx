'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, TrendingUp, Target, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useGraphStore } from '@/lib/store/graphStore'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export default function AnalysisPanel() {
  const { analysis, nodes } = useGraphStore()
  const [isOpen, setIsOpen] = useState(true)

  if (!analysis || nodes.length === 0) {
    return null
  }

  const getDiscourseColor = (type: string) => {
    switch (type) {
      case 'Focused':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'Dispersed':
        return 'text-amber-600 bg-amber-50 border-amber-200'
      case 'Biased':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200'
    }
  }

  const getComplexityLabel = (score: number) => {
    if (score < 30) return 'Simple'
    if (score < 60) return 'Moderate'
    if (score < 80) return 'Complex'
    return 'Very Complex'
  }

  const getComplexityColor = (score: number) => {
    if (score < 30) return 'text-green-600'
    if (score < 60) return 'text-blue-600'
    if (score < 80) return 'text-amber-600'
    return 'text-red-600'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="absolute top-4 right-4 w-80 glass-morphism rounded-2xl shadow-2xl border border-slate-200/50 overflow-hidden z-10"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-200/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-600" />
                Analysis Results
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-200/50 transition-colors"
              >
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Main Intent */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <TrendingUp className="h-3 w-3" />
                Main Intent
              </div>
              <p className="text-sm text-slate-800 leading-relaxed">
                {analysis.main_intent}
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3">
              {/* Complexity Score */}
              <div className="p-3 rounded-xl bg-white/60 border border-slate-200/50">
                <div className="text-xs text-slate-500 mb-1">Complexity</div>
                <div className="flex items-baseline gap-1">
                  <span
                    className={cn(
                      'text-2xl font-bold',
                      getComplexityColor(analysis.complexity_score)
                    )}
                  >
                    {analysis.complexity_score}
                  </span>
                  <span className="text-xs text-slate-500">/100</span>
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {getComplexityLabel(analysis.complexity_score)}
                </div>
              </div>

              {/* Discourse Type */}
              <div className="p-3 rounded-xl bg-white/60 border border-slate-200/50">
                <div className="text-xs text-slate-500 mb-1">Discourse</div>
                <div
                  className={cn(
                    'text-sm font-semibold px-2 py-1 rounded-lg border inline-block mt-1',
                    getDiscourseColor(analysis.discourse_type)
                  )}
                >
                  {analysis.discourse_type}
                </div>
              </div>
            </div>

            {/* Node Breakdown */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <CheckCircle2 className="h-3 w-3" />
                Node Breakdown
              </div>
              <div className="space-y-1">
                {['intent', 'constraint', 'persona', 'knowledge'].map(
                  (type) => {
                    const count = analysis.nodes.filter(
                      (n) => n.type === type
                    ).length
                    if (count === 0) return null

                    return (
                      <div
                        key={type}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-slate-600 capitalize">
                          {type}s
                        </span>
                        <span className="font-semibold text-slate-900">
                          {count}
                        </span>
                      </div>
                    )
                  }
                )}
              </div>
            </div>

            {/* Structural Gaps */}
            {analysis.structural_gaps.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 uppercase tracking-wider">
                  <AlertTriangle className="h-3 w-3" />
                  Structural Gaps ({analysis.structural_gaps.length})
                </div>
                <div className="space-y-2">
                  {analysis.structural_gaps.slice(0, 3).map((gap) => (
                    <div
                      key={gap.id}
                      className="p-3 rounded-lg bg-purple-50/60 border border-purple-200/50"
                    >
                      <div className="text-xs font-semibold text-purple-900 mb-1">
                        {gap.suggested_concept}
                      </div>
                      <div className="text-xs text-purple-700 leading-relaxed">
                        {gap.reason}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Reopen button when closed */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setIsOpen(true)}
          className="absolute top-4 right-4 p-3 glass-morphism rounded-xl shadow-lg border border-slate-200/50 hover:scale-110 transition-transform z-10"
        >
          <Target className="h-5 w-5 text-blue-600" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
