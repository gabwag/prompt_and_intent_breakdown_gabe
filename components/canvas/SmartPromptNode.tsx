'use client'

import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { motion } from 'framer-motion'
import { Lightbulb, AlertCircle, User, BookOpen, Zap } from 'lucide-react'
import type { NodeData, NodeType } from '@/types/graph'
import { cn, getNodeColor } from '@/lib/utils'
import { useGraphStore } from '@/lib/store/graphStore'

interface SmartPromptNodeProps {
  id: string
  data: NodeData
}

function SmartPromptNode({ id, data }: SmartPromptNodeProps) {
  const { expandNode } = useGraphStore()
  const nodeType = data.type
  const colors = getNodeColor(nodeType)

  const handleExpand = () => {
    expandNode(id)
  }

  // Get icon based on node type
  const getIcon = () => {
    const iconClass = 'h-4 w-4'
    switch (nodeType) {
      case 'intent':
        return <Zap className={iconClass} />
      case 'constraint':
        return <AlertCircle className={iconClass} />
      case 'persona':
        return <User className={iconClass} />
      case 'knowledge':
        return <BookOpen className={iconClass} />
      case 'gap':
        return <Lightbulb className={iconClass} />
      default:
        return <Zap className={iconClass} />
    }
  }

  return (
    <>
      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-slate-400"
      />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={cn(
          'min-w-[250px] max-w-[300px]',
          'glass-morphism',
          'rounded-xl shadow-lg',
          'border-2',
          colors.border,
          'group cursor-pointer',
          'hover:shadow-2xl hover:scale-105',
          'transition-all duration-200'
        )}
        onClick={handleExpand}
      >
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div
              className={cn(
                'p-2 rounded-lg',
                colors.bg,
                'border',
                colors.border
              )}
            >
              {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'text-xs font-semibold uppercase tracking-wider',
                    colors.text
                  )}
                >
                  {nodeType}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mt-1 line-clamp-2">
                {data.label}
              </h3>
            </div>
          </div>

          {/* Text Segment (if available) */}
          {data.textSegment && (
            <div
              className={cn(
                'p-3 rounded-lg text-xs',
                'bg-white/60 border',
                colors.border,
                'italic text-slate-700 line-clamp-3'
              )}
            >
              &quot;{data.textSegment}&quot;
            </div>
          )}

          {/* Explanation */}
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
            {data.explanation}
          </p>

          {/* Expand hint */}
          <div className="pt-2 border-t border-slate-200/50">
            <p className="text-xs text-slate-400 group-hover:text-blue-500 transition-colors">
              Click to expand connections →
            </p>
          </div>
        </div>
      </motion.div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-slate-400"
      />
    </>
  )
}

export default memo(SmartPromptNode)
