'use client'

import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { motion } from 'framer-motion'
import { Ghost, Sparkles } from 'lucide-react'
import type { NodeData } from '@/types/graph'
import { cn } from '@/lib/utils'
import { useGraphStore } from '@/lib/store/graphStore'

interface GhostNodeProps {
  id: string
  data: NodeData
}

function GhostNode({ id, data }: GhostNodeProps) {
  const { materializeGhost } = useGraphStore()

  const handleMaterialize = () => {
    materializeGhost(id)
  }

  const label = data.label
  const gapInfo = data.gapInfo

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-purple-400"
      />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.8 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={cn(
          'min-w-[250px] max-w-[280px]',
          'ghost-node',
          'bg-purple-50/40 backdrop-blur-md',
          'rounded-xl shadow-md',
          'border-2 border-dashed border-purple-300/60',
          'cursor-pointer group',
          'hover:border-purple-400 hover:bg-purple-50/60',
          'hover:shadow-xl hover:scale-105',
          'transition-all duration-300'
        )}
        onClick={handleMaterialize}
      >
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-100/60 border border-purple-300/50">
              <Ghost className="h-4 w-4 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-700">
                  Structural Gap
                </span>
                <Sparkles className="h-3 w-3 text-purple-400" />
              </div>
              <h3 className="text-sm font-semibold text-purple-900 mt-1 line-clamp-2">
                {label}
              </h3>
            </div>
          </div>

          {/* Gap Reason */}
          {gapInfo && (
            <div className="p-3 rounded-lg bg-white/40 border border-purple-200/50">
              <p className="text-xs text-purple-800 leading-relaxed">
                💡 {gapInfo.reason}
              </p>
            </div>
          )}

          {/* Materialize hint */}
          <div className="pt-2 border-t border-purple-200/50">
            <p className="text-xs text-purple-500 group-hover:text-purple-700 transition-colors flex items-center gap-1">
              <span>Click to materialize this concept</span>
              <span className="text-purple-400">✨</span>
            </p>
          </div>
        </div>
      </motion.div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-purple-400"
      />
    </>
  )
}

export default memo(GhostNode)
