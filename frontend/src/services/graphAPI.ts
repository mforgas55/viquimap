// src/services/graphApi.ts
import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000',
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
  idsourcenode: number
  idtargetnode: number
}

export interface ViewportGraphData {
  nodes: NodeDTO[]
  edges: EdgeDTO[]
}

interface RawNodeDTO {
  id: number
  title: string
  position: string
  size: number
}

interface RawViewportGraphData {
    nodes: RawNodeDTO[]
    edges: EdgeDTO[]
}

function parseWktPoint(wkt: string): { x: number; y: number } {
  const match = wkt.match(/POINT\s*\(\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s*\)/i)

  const xStr = match?.[1]
  const yStr = match?.[2]

  if (!xStr || !yStr) {
    throw new Error(`Unable to parse WKT point: "${wkt}"`)
  }

  const x = parseFloat(xStr)
  const y = parseFloat(yStr)

  if (Number.isNaN(x) || Number.isNaN(y)) {
    throw new Error(`Parsed non-numeric coordinates from WKT point: "${wkt}"`)
  }

  return { x, y }
}

function normalizeNode(raw: RawNodeDTO): NodeDTO {
  const { x, y } = parseWktPoint(raw.position)
  return {
    id: raw.id,
    title: raw.title,
    x,
    y,
    size: raw.size,
  }
}

export async function fetchGraphInBounds(xmin: number, ymin: number, xmax: number, ymax: number, signal?: AbortSignal): Promise<ViewportGraphData> {
  const { data } = await apiClient.get<RawViewportGraphData>('/nodes', {
    params: { xmin, ymin, xmax, ymax },
    signal,
  })
  return {
    nodes: data.nodes.map(normalizeNode),
    edges: data.edges
  }
}