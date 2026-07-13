<template>
  <div ref="containerRef" class="sigma-container"></div>
</template>



<script setup lang="ts">

//Default script from the SigmaJS demo

import { ref, onMounted, onBeforeUnmount } from 'vue'
import Graph from 'graphology'
import Sigma from 'sigma'
import { fetchGraphInBounds } from '@/services/graphAPI'
import type { NodeDTO, EdgeDTO, ViewportGraphData } from '@/services/graphAPI'

import { addEdgesToGraph, addNodesToGraph } from '@/manageGraph'

const containerRef = ref<HTMLDivElement | null>(null)
let sigmaInstance: Sigma | null = null

onMounted(async () => {
  if (!containerRef.value) return

  // Create a graphology graph
  const graph = new Graph()

  // Instantiate sigma.js and render the graph
  sigmaInstance = new Sigma(graph, containerRef.value)

  // First run
  const visibleData = await fetchGraphInBounds(0,0,10,10)
  const visibleNodes = visibleData.nodes
  const visibleEdges = visibleData.edges

  addNodesToGraph(graph, visibleNodes)
  addEdgesToGraph(graph, visibleEdges)


 
  graph.addNode('1', { label: 'Node 1', x: 0, y: 0, size: 10, color: 'blue' })
  graph.addNode('2', { label: 'Node 2', x: 1, y: 1, size: 20, color: 'red' })
  graph.addEdge('1', '2', { size: 5, color: 'purple' })
})

onBeforeUnmount(() => {
  // Clean up to avoid memory leaks / duplicate WebGL contexts on unmount
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