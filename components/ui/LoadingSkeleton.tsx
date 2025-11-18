'use client'

import { motion } from 'framer-motion'

export function NodeSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-w-[250px] max-w-[300px] glass-morphism rounded-xl shadow-lg border-2 border-slate-200 p-4"
    >
      <div className="space-y-3">
        {/* Header skeleton */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-200 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Content skeleton */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-slate-200 rounded animate-pulse" />
          <div className="h-3 w-4/5 bg-slate-200 rounded animate-pulse" />
        </div>
      </div>
    </motion.div>
  )
}

export function CanvasLoadingState() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
          />
        </div>
        <p className="text-slate-600 font-medium">Analyzing your prompt...</p>
        <p className="text-xs text-slate-500">
          Building semantic network graph
        </p>
      </div>
    </div>
  )
}
