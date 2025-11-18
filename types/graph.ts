import { Node as ReactFlowNode, Edge as ReactFlowEdge } from '@xyflow/react'

/**
 * Node types in the prompt graph
 */
export type NodeType = 'intent' | 'constraint' | 'persona' | 'knowledge' | 'gap'

/**
 * Discourse analysis types
 */
export type DiscourseType = 'Focused' | 'Dispersed' | 'Biased'

/**
 * Edge relationship types
 */
export type RelationType =
  | 'defines'
  | 'requires'
  | 'constrains'
  | 'expands'
  | 'conflicts'
  | 'supports'

/**
 * Base graph node structure
 */
export interface GraphNode {
  id: string
  label: string
  type: NodeType
  explanation: string
  color_hex: string
  textSegment?: string // The exact text from the prompt
  startIndex?: number // Where this segment starts in the original prompt
  endIndex?: number // Where this segment ends in the original prompt
}

/**
 * Graph edge structure
 */
export interface GraphEdge {
  id: string
  source: string
  target: string
  relation: RelationType
  weight: 'weak' | 'medium' | 'strong'
}

/**
 * Structural gap (Ghost Node) structure
 */
export interface StructuralGap {
  id: string
  source_node_id: string
  suggested_concept: string
  reason: string
  materialized: boolean // Whether the ghost has been materialized
}

/**
 * Complete analysis result from Gemini
 */
export interface PromptAnalysis {
  main_intent: string
  complexity_score: number // 0-100
  discourse_type: DiscourseType
  nodes: GraphNode[]
  edges: GraphEdge[]
  structural_gaps: StructuralGap[]
}

/**
 * React Flow node data
 */
export interface NodeData extends Record<string, unknown> {
  label: string
  type: NodeType
  explanation: string
  color: string
  textSegment?: string
  onExpand?: (nodeId: string) => void
  isGhost?: boolean
  gapInfo?: StructuralGap
}

/**
 * React Flow types
 */
export type FlowNode = ReactFlowNode<NodeData>
export type FlowEdge = ReactFlowEdge

/**
 * Highlight segment for text visualization
 */
export interface HighlightSegment {
  nodeId: string
  text: string
  type: NodeType
  explanation: string
  startIndex: number
  endIndex: number
}

/**
 * Canvas position
 */
export interface Position {
  x: number
  y: number
}
