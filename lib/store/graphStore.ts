import { create } from 'zustand'
import { produce } from 'immer'
import type {
  FlowNode,
  FlowEdge,
  PromptAnalysis,
  StructuralGap,
  NodeData,
} from '@/types/graph'
import { generateId, getNodeColor, calculateChildPosition } from '@/lib/utils'

interface GraphState {
  // Core state
  nodes: FlowNode[]
  edges: FlowEdge[]
  ghostNodes: StructuralGap[]
  originalPrompt: string
  analysis: PromptAnalysis | null
  isAnalyzing: boolean

  // Actions
  setAnalysis: (analysis: PromptAnalysis, prompt: string) => void
  addNode: (node: FlowNode) => void
  addEdge: (edge: FlowEdge) => void
  expandNode: (nodeId: string) => void
  materializeGhost: (gapId: string) => void
  resetGraph: () => void
  setIsAnalyzing: (isAnalyzing: boolean) => void
}

export const useGraphStore = create<GraphState>((set, get) => ({
  // Initial state
  nodes: [],
  edges: [],
  ghostNodes: [],
  originalPrompt: '',
  analysis: null,
  isAnalyzing: false,

  // Set analysis results and initialize graph
  setAnalysis: (analysis: PromptAnalysis, prompt: string) => {
    set(
      produce((state: GraphState) => {
        state.analysis = analysis
        state.originalPrompt = prompt
        state.ghostNodes = analysis.structural_gaps

        // Convert analysis nodes to React Flow nodes
        state.nodes = analysis.nodes.map((node, index) => {
          const colors = getNodeColor(node.type)
          const angle = (2 * Math.PI * index) / analysis.nodes.length
          const radius = 300

          return {
            id: node.id,
            type: 'smartPrompt',
            position: {
              x: 500 + radius * Math.cos(angle),
              y: 300 + radius * Math.sin(angle),
            },
            data: {
              label: node.label,
              type: node.type,
              explanation: node.explanation,
              color: colors.hex,
              textSegment: node.textSegment,
            } as NodeData,
          }
        })

        // Convert analysis edges to React Flow edges
        state.edges = analysis.edges.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: 'smoothstep',
          animated: edge.weight === 'strong',
          style: {
            stroke:
              edge.weight === 'strong'
                ? '#3B82F6'
                : edge.weight === 'medium'
                  ? '#94A3B8'
                  : '#CBD5E1',
            strokeWidth: edge.weight === 'strong' ? 3 : 2,
          },
          label: edge.relation,
          labelStyle: {
            fontSize: 11,
            fill: '#64748B',
          },
        }))

        // Add ghost nodes
        const ghostNodesAsFlowNodes = analysis.structural_gaps.map((gap) => {
          const sourceNode = state.nodes.find((n) => n.id === gap.source_node_id)
          const position = sourceNode
            ? { x: sourceNode.position.x + 200, y: sourceNode.position.y + 100 }
            : { x: 800, y: 400 }

          return {
            id: gap.id,
            type: 'ghost',
            position,
            data: {
              label: gap.suggested_concept,
              type: 'gap' as const,
              explanation: gap.reason,
              color: '#A855F7',
              isGhost: true,
              gapInfo: gap,
            } as NodeData,
          }
        })

        state.nodes.push(...ghostNodesAsFlowNodes)
      })
    )
  },

  // Add a new node
  addNode: (node: FlowNode) => {
    set(
      produce((state: GraphState) => {
        state.nodes.push(node)
      })
    )
  },

  // Add a new edge
  addEdge: (edge: FlowEdge) => {
    set(
      produce((state: GraphState) => {
        state.edges.push(edge)
      })
    )
  },

  // Expand a node (spawn children)
  expandNode: (nodeId: string) => {
    set(
      produce((state: GraphState) => {
        const parentNode = state.nodes.find((n) => n.id === nodeId)
        if (!parentNode) return

        // Find edges where this node is the source
        const childEdges = state.edges.filter((e) => e.source === nodeId)
        const existingChildren = childEdges.map((e) => e.target)

        // If already expanded, don't expand again
        if (existingChildren.length > 0) return

        // Find potential child nodes from edges
        const potentialChildren = state.analysis?.edges.filter(
          (e) => e.source === nodeId
        )

        if (!potentialChildren || potentialChildren.length === 0) {
          // Create a generic expansion node
          const newNodeId = generateId('expand')
          const colors = getNodeColor(parentNode.data.type)

          const newNode: FlowNode = {
            id: newNodeId,
            type: 'smartPrompt',
            position: {
              x: parentNode.position.x + 250,
              y: parentNode.position.y,
            },
            data: {
              label: `Related to: ${parentNode.data.label}`,
              type: parentNode.data.type,
              explanation: 'Expanded context from parent node',
              color: colors.hex,
            },
          }

          const newEdge: FlowEdge = {
            id: generateId('edge'),
            source: nodeId,
            target: newNodeId,
            type: 'smoothstep',
            animated: true,
          }

          state.nodes.push(newNode)
          state.edges.push(newEdge)
        }
      })
    )
  },

  // Materialize a ghost node (make it solid)
  materializeGhost: (gapId: string) => {
    set(
      produce((state: GraphState) => {
        // Find the ghost node
        const ghostIndex = state.nodes.findIndex((n) => n.id === gapId)
        if (ghostIndex === -1) return

        // Mark as materialized
        const gap = state.ghostNodes.find((g) => g.id === gapId)
        if (gap) {
          gap.materialized = true
        }

        // Update the node to be solid (no longer a ghost)
        state.nodes[ghostIndex] = {
          ...state.nodes[ghostIndex],
          type: 'smartPrompt',
          data: {
            ...state.nodes[ghostIndex].data,
            isGhost: false,
          },
        }

        // Add edge from source node to materialized ghost
        if (gap) {
          const newEdge: FlowEdge = {
            id: generateId('edge'),
            source: gap.source_node_id,
            target: gapId,
            type: 'smoothstep',
            animated: true,
            style: {
              strokeDasharray: '5,5',
              stroke: '#A855F7',
            },
            label: 'fills gap',
          }
          state.edges.push(newEdge)
        }
      })
    )
  },

  // Reset graph
  resetGraph: () => {
    set({
      nodes: [],
      edges: [],
      ghostNodes: [],
      originalPrompt: '',
      analysis: null,
      isAnalyzing: false,
    })
  },

  // Set analyzing state
  setIsAnalyzing: (isAnalyzing: boolean) => {
    set({ isAnalyzing })
  },
}))
