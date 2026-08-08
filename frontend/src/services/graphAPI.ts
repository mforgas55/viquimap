// src/services/graphApi.ts
import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://192.168.1.32:3000',
  timeout: 10000,
})

export interface NodeDTO {
  id: number
  title: string
  x: number
  y: number
  size: number
}

export interface EdgeDTO {
  sourceId: number
  targetId: number
}

export interface ViewportGraphData {
  nodesBBox: NodeDTO[]
  edges: EdgeDTO[]
  outlyingNodes: NodeDTO[]
}

interface RawNodeDTO {
  pageId: number
  title: string
  position: string
  node_radius: number
}

interface RawViewportGraphData {
    nodesBBox: RawNodeDTO[]
    edges: EdgeDTO[]
    outlyingNodes: RawNodeDTO[]
}

function parseWktPoint(wkt: string): { x: number; y: number } {
  const match = wkt.match(/POINT\s*\(\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s*\)/i)

  const xStr = match?.[1]
  const yStr = match?.[2]

  if (!xStr || !yStr) {
    throw new Error(`Unable to parse WKT point: "${wkt}"`)
  }

  const x = parseFloat(xStr) * 100.0
  const y = parseFloat(yStr) * 100.0

  if (Number.isNaN(x) || Number.isNaN(y)) {
    throw new Error(`Parsed non-numeric coordinates from WKT point: "${wkt}"`)
  }

  return { x, y }
}

function normalizeNode(raw: RawNodeDTO): NodeDTO {
  const { x, y } = parseWktPoint(raw.position)
  return {
    id: raw.pageId,
    title: raw.title,
    x,
    y,
    size: raw.node_radius,
  }
}

export async function fetchGraphInBounds(xmin: number, ymin: number, xmax: number, ymax: number, signal?: AbortSignal): Promise<ViewportGraphData> {
  
  const { data } = await apiClient.get<RawViewportGraphData>('/nodes', {
    params: { xmin, ymin, xmax, ymax },
    signal,
  })
  console.log(data.nodesBBox.map(normalizeNode))
  console.log(data.outlyingNodes.map(normalizeNode))
  return {
    nodesBBox: data.nodesBBox.map(normalizeNode),
    edges: data.edges,
    outlyingNodes: data.outlyingNodes.map(normalizeNode),
  }
}