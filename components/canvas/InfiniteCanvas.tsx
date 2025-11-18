'use client'

import { useCallback, useMemo, useEffect } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  BackgroundVariant,
  Node,
  Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useGraphStore } from '@/lib/store/graphStore'
import SmartPromptNode from './SmartPromptNode'
import GhostNode from './GhostNode'
import AnalysisPanel from './AnalysisPanel'

const nodeTypes = {
  smartPrompt: SmartPromptNode as any,
  ghost: GhostNode as any,
}

export default function InfiniteCanvas() {
  const { nodes: storeNodes, edges: storeEdges } = useGraphStore()

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([] as Node[])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([] as Edge[])

  // Sync store changes to local state
  useEffect(() => {
    setNodes(storeNodes as Node[])
    setEdges(storeEdges as Edge[])
  }, [storeNodes, storeEdges, setNodes, setEdges])

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  return (
    <div className="h-full w-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false,
        }}
        minZoom={0.2}
        maxZoom={2}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: false,
          style: { strokeWidth: 2 },
        }}
        className="bg-slate-50"
        proOptions={{ hideAttribution: true }}
      >
        {/* Infinite grid background */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#cbd5e1"
          className="opacity-50"
        />

        {/* Controls for zoom/pan */}
        <Controls
          className="!border-slate-200 !bg-white/80 !backdrop-blur-md !shadow-lg"
          showInteractive={false}
        />

        {/* Mini map */}
        <MiniMap
          className="!border-slate-200 !bg-white/80 !backdrop-blur-md !shadow-lg"
          nodeColor={(node) => {
            const colors: Record<string, string> = {
              intent: '#3B82F6',
              constraint: '#F59E0B',
              persona: '#10B981',
              knowledge: '#6366F1',
              gap: '#A855F7',
            }
            const nodeType = (node.data as Record<string, unknown>)?.type as string
            return colors[nodeType] || '#94A3B8'
          }}
          maskColor="rgb(240, 240, 255, 0.6)"
        />

        {/* Analysis Panel */}
        <AnalysisPanel />
      </ReactFlow>
    </div>
  )
}
