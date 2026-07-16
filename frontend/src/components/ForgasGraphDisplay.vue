<template>
  <div ref="containerRef" class="sigma-container"></div>
</template>



<script setup lang="ts">

//Default script from the SigmaJS demo

import { ref, onMounted, onBeforeUnmount } from 'vue'
import Graph from 'graphology'
import Sigma from 'sigma'
import { fitViewportToNodes } from "@sigma/utils";
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

  sigmaInstance.getCamera().animate(
    { x: 0.5, y: 0.5, ratio: 0.05 }, // ratio menor = més zoom
    { duration: 500 } // ms d'animació, opcional
  );

  // First run
  const visibleData = await fetchGraphInBounds(0,0,5,5)
  const visibleNodes = visibleData.nodesBBox
  const visibleEdges = visibleData.edges
  const outlyingNodes = visibleData.outlyingNodes 

  addNodesToGraph(graph, visibleNodes)
  addNodesToGraph(graph, outlyingNodes)
  addEdgesToGraph(graph, visibleEdges) //Degut al query limit dels outlyingNodes, hi han edges amb nodes que no formen part del graf

  const idVisibleNodes: string[] = visibleNodes.map((node) => String(node.id));

  fitViewportToNodes(sigmaInstance, idVisibleNodes)

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