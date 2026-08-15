<template>
  <div ref="containerRef" class="sigma-container"></div>
</template>



<script setup lang="ts">

//Default script from the SigmaJS demo

import { ref, onMounted, onBeforeUnmount } from 'vue'
import Graph from 'graphology'
import Sigma from 'sigma'
import axios from 'axios'
import { fitViewportToNodes } from "@sigma/utils";
import { fetchGraphInBounds } from '@/services/graphAPI'
import type { NodeDTO, EdgeDTO, ViewportGraphData } from '@/services/graphAPI'

import { addEdgesToGraph, addNodesToGraph } from '@/manageGraph'

const containerRef = ref<HTMLDivElement | null>(null)
let sigmaInstance: Sigma | null = null
let graph: Graph | null = null

let abortController: AbortController | null = null
let debounceTimer: ReturnType<typeof setTimeout> | null = null


//Returns the graph positions of the viewport's bounds
function getViewportBounds() {
  if (!sigmaInstance) return null
  const { width, height } = sigmaInstance.getDimensions()
  const topLeft = sigmaInstance.viewportToGraph({ x: 0, y: 0 })
  const bottomRight = sigmaInstance.viewportToGraph({ x: width, y: height })
  return {
    minX: Math.min(topLeft.x, bottomRight.x),
    maxX: Math.max(topLeft.x, bottomRight.x),
    minY: Math.min(topLeft.y, bottomRight.y),
    maxY: Math.max(topLeft.y, bottomRight.y),
  }
}


//For any given viewport coordinates, loads the required graph content
async function loadViewportData() {
  const bounds = getViewportBounds()
  if (!bounds) return

  // Cancel any in-flight request — prevents a slow, stale response
  // from overwriting newer data once the user has moved on.
  abortController?.abort()
  abortController = new AbortController()

  try {
    const { nodesBBox, edges, outlyingNodes } = await fetchGraphInBounds(
      bounds.minX,
      bounds.minY,
      bounds.maxX,
      bounds.maxY,
      abortController.signal
    )

    nodesBBox.forEach((n) => {
      if (graph && !graph.hasNode(n.id)) {
        graph.addNode(n.id, {
          label: n.title,
          x: n.x,
          y: n.y,
          size: n.size,
          color: '#5B8DEF',
        })
      }
    })

    outlyingNodes.forEach((n) => {
      if (graph && !graph.hasNode(n.id)) {
        graph.addNode(n.id, {
          label: n.title,
          x: n.x,
          y: n.y,
          size: n.size,
          color: '#5B8DEF',
        })
      }
    })

    /*edges.forEach((e) => {
      if (graph && !graph.hasEdge(e.sourceId, e.targetId)) {
        graph.addEdge(e.sourceId, e.targetId, {size: 1, color: "white"})
      }
    })*/

    sigmaInstance?.refresh()
  } catch (err) {
    if (axios.isCancel(err)) return // superseded by a newer request, ignore
    console.error('Failed to load graph viewport data', err)
  }
}
// Handles the load of new data with a debouncer
function scheduleLoad() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(loadViewportData, 250)
}

onMounted(async () => {
  if (!containerRef.value) return

  // Create a graphology graph
  graph = new Graph()

  // Instantiate sigma.js and render the graph
  sigmaInstance = new Sigma(graph, containerRef.value, {
    // This flag tells sigma to disable the nodes and edges sizes interpolation
    // and instead scales them in the same way it handles positions:
    itemSizesReference: "positions",
    // This function tells sigma to grow sizes linearly with the zoom, instead
    // of relatively to the zoom ratio's square root:
    //zoomToSizeRatioFunction: (x) => x,
    // This disables the default sigma rescaling, so that by default, positions
    // and sizes are preserved on screen (in pixels):
    autoRescale: false,
  })

  // graph.addNode("Node 0,0", {
  //   x:0,
  //   y:0,
  //   size: 50,
  //   color: "#FF0000"
  // })

  sigmaInstance.getCamera().on('updated', scheduleLoad) //Whenever camera is updated, scheduleLoad is called
  sigmaInstance.getCamera().animate(
    { x: 0.5, y: 0.5, ratio: 0.05 }, // ratio menor = més zoom
    { duration: 500 } // ms d'animació, opcional
  );

  
  const visibleData = await fetchGraphInBounds(0,0,5,5)
  const visibleNodes = visibleData.nodesBBox
  //const visibleEdges = visibleData.edges
  const outlyingNodes = visibleData.outlyingNodes 

  addNodesToGraph(graph, visibleNodes)
  addNodesToGraph(graph, outlyingNodes)
  //addEdgesToGraph(graph, visibleEdges) //Degut al query limit dels outlyingNodes, hi han edges amb nodes que no formen part del graf

  const idVisibleNodes: string[] = visibleNodes.map((node) => String(node.id));

  fitViewportToNodes(sigmaInstance, idVisibleNodes)

  //Alternatively to all that code above, just call
  //loadViewportData()

})

onBeforeUnmount(() => {
  // Clean up to avoid memory leaks / duplicate WebGL contexts on unmount
  if (debounceTimer) clearTimeout(debounceTimer)
  abortController?.abort()
  sigmaInstance?.kill()
  sigmaInstance = null
})
</script>

<style scoped>
.sigma-container {
  width: 800px;
  height: 600px;
  background: rgb(28, 49, 44);
}
</style>