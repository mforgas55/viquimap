//IDK on ficar aixo. Ho deixo aqui mashallah renewakbar

import Graph from 'graphology'
import type {NodeDTO, EdgeDTO} from '@/services/graphAPI'

export function addNodesToGraph(graph: Graph, nodes: NodeDTO[]): void {
    nodes.forEach((node) =>{
        if(!graph.hasNode(node.id)){
            graph.addNode(node.id, {
                label: node.title,
                size: node.size,
                x: node.x,
                y: node.y
            })
            console.log('Node added')
        }
    })
}

export function addEdgesToGraph(graph: Graph, edges: EdgeDTO[]): void {
    edges.forEach((edge) => {
        if(graph.hasNode(edge.sourceId) && graph.hasNode(edge.targetId) && !graph.hasEdge(edge.sourceId, edge.targetId)){
            graph.addEdge(edge.sourceId, edge.targetId)
        }
    })
}