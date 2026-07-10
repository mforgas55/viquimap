import networkit
import json

def createGraph(conn):
    cur = conn.cursor() # El cursor es qui envia ordres i rep dades de la DB
    
    # ----- 1. CREAR GRAF PRINCIPAL -----
    cur.execute("SELECT page_id FROM nodes n;") # Creem el graf amb tots els nodes
    allNodes = cur.fetchall()
    
    mapNodes = {} # Com els ids dels nodes no estan ordenats i no van de 0 a n-1, farem un mapeig amb les posicions del graph
    idAssociated = 0

    for node in allNodes:
        mapNodes[node[0]] = idAssociated
        idAssociated+=1   
    saveDictIntoJSON(mapNodes, "./data/maps/mapNodes.json")
    
    mapNodesToPage = {id_graph: page_id for page_id, id_graph in mapNodes.items()}

    G = setEdges(cur, mapNodes)
    saveGraph(G, "./data/graphs/grafv0.nkb")

    # ----- 2. SALVAR NODES QUE NO FORMEN PART DE LA PRINCIPAL C.C -----
    nodesNotInMainCC = getNodesNotInMainCC(G)
    pagesNotInMainCC = []
    for idNode in nodesNotInMainCC: # Apuntar tots els page_id dels nodes que no formen part de la main c.c
        pagesNotInMainCC.append(mapNodesToPage[idNode])
    print(f"Nombre de nodes notInMainCC: {len(pagesNotInMainCC)}\n Pages notInMainCC: {pagesNotInMainCC}\n")

    cur.execute("TRUNCATE TABLE notInMainCC;") # Esborrem el contingut anterior
    
    if pagesNotInMainCC: # Si pagesNotInMainCC fos buida donaria error SQL
        query = """
            INSERT INTO notInMainCC (page_id)
            SELECT page_id FROM nodes
            WHERE page_id IN %s;
        """
        cur.execute(query, (tuple(pagesNotInMainCC),))  # Fiquem els nodes notInMainCC a la taula
    
    # ----- 3. CREAR PRINCIPAL C.C -----
    mapNodesMainCC = {} 
    idAssociated = 0
    for node in allNodes:
        if not node[0] in pagesNotInMainCC:
            mapNodesMainCC[node[0]] = idAssociated
            idAssociated+=1
    saveDictIntoJSON(mapNodesMainCC, "./data/maps/mapNodesMainCC.json")

    mainCC = setEdges(cur, mapNodesMainCC)
    saveGraph(mainCC, "./data/graphs/mainCCv0.nkb")

    # ------
    print("Graf i mapeig guardat correctament!")
    cur.close()
    conn.commit() # Guardem els canvis que es realizen a la BD

    

# Espera un cursor de la DB al que fer consultes i un mapeig de nodes page_id: id_graf
def setEdges(cur, mapNodes):
    size = len(mapNodes) # Mida final havent descartat nodes aillats
    G = networkit.graph.Graph(n=size, weighted=False, directed=True) # Creem graf, on ja te els n vertexs sense adjacencies numerats de 0 a n-1

    # Utilitzem una query neta que ens dona l'origen i el destí
    queryGetEdges = "SELECT idsourcenode, idtargetnode FROM edges;"
    cur.execute(queryGetEdges)
    
    mida_bloc = 100000  # Mida del bloc
    comptador_arestes = 0
    
    while True:
        # fetchmany demana a PostgreSQL només la quantitat de files indicada
        bloc_arestes = cur.fetchmany(mida_bloc) # El cursor avança 100k
        
        if not bloc_arestes:
            break # Si no hi ha més arestes, sortim del bucle
            
        for src, tgt in bloc_arestes:          
            if src in mapNodes and tgt in mapNodes: # En el cas de ser el graf principal aixo sempre es compleix, 
                # pero en el cas de fer la mainCC, ens protegeix d'adjacencies que no formen part de la mainCC, ergo no es troben en el mapNodes passat com a parametre
                idGraphNodeSource = mapNodes[src]
                idGraphNodeTarget = mapNodes[tgt]
                
                G.addEdge(idGraphNodeSource, idGraphNodeTarget)
        
        comptador_arestes += len(bloc_arestes)
        print(f"Arestes processades acumulades: {comptador_arestes}")
    
    return G 

def getNodesNotInMainCC(G):
    wcc = networkit.components.WeaklyConnectedComponents(G) 
    wcc.run() #Calcul de les components conexes
    component_sizes = wcc.getComponentSizes()
    print(f"Mida de les components: {component_sizes}\n")
    idMaxCC = max(component_sizes, key=component_sizes.get) # Seleccionem obtenir la clau amb VALOR maxim
    sizeMaxCC = component_sizes[idMaxCC]
    
    for cc_size in component_sizes.values():
        if(cc_size>5 and cc_size!=sizeMaxCC):
            print("S'ha trobat una component conexa amb mida superior a 5, potser s'ha de considerar...")

    idNodesNotInMaxCC = []
    for n in G.iterNodes():
        if wcc.componentOfNode(n) != idMaxCC: 
            idNodesNotInMaxCC.append(n)
    
    return idNodesNotInMaxCC
    
def saveGraph(G, path):
    networkit.graphio.writeGraph(G, path, networkit.Format.NetworkitBinary)
    print(f"Graf {path} guardat correctament\n")

def saveDictIntoJSON(dict, path):
    with open(path, "w") as f1: 
        json.dump(dict, f1)
    print(f"Dict {path} guardat correctament\n")
