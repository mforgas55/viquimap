import networkit
import math
import json
from psycopg2.extras import execute_values

def setPageRank(conn):
    # Obrir el graf; Calcularem el pagerank de TOTS els nodes
    ruta_fitxer = "./data/graphs/grafv0.nkb"
    G = networkit.graphio.readGraph(ruta_fitxer, networkit.Format.NetworkitBinary)

    with open("./data/maps/mapNodes.json", "r") as f:
        mapNodes = json.load(f) # Recordem que es page_id -> node_id en el graf
    
    # json converteix les keys a strings, cal recuperar page_id com a int
    mapNodes = {int(page_id): id_graf for page_id, id_graf in mapNodes.items()} # Un objecte JSON es un {"key": value}
    mapNodeToPage = {id_graf: page_id for page_id, id_graf in mapNodes.items()} # Ara l'objecte ja es del diccionari on es {int: int}
    dampingFactor=0.85
    tol=1e-6
    pr = networkit.centrality.PageRank(G, dampingFactor, tol)
    pr.run() # Executa el càlcul en paral·lel
    scores = pr.scores() # Retorna una llista amb el PageRank de cada node ordenat per l'ID del node
    print(scores)

    # normalitzacio del pagerank. son valors molt petits
    nodes_radius = scores_to_radius(scores) # establir el pagerank com a radi de cada node
    
    # ------ PUJAR RESULTATS --------
    cur = conn.cursor()

    cur.execute("UPDATE nodes SET pagerank_raw = NULL, node_radius = NULL;") # Buidem el contingut anterior

    nodes_data = []

    for node_id in range(G.numberOfNodes()): # Creem un rang del 0 a N-1 per crear la llista de dades a pujar
        page_id = mapNodeToPage[node_id]
        pagerank_raw_node = scores[node_id]
        radius_node = nodes_radius[node_id]
        nodes_data.append((page_id, pagerank_raw_node, radius_node))

    execute_values(
        cur,
        """
        INSERT INTO nodes (page_id, pagerank_raw, node_radius)
        VALUES %s
        ON CONFLICT (page_id) DO UPDATE SET
            pagerank_raw = EXCLUDED.pagerank_raw,
            node_radius = EXCLUDED.node_radius
        """,
        nodes_data,
        page_size=10000
    )
    cur.close()
    conn.commit()
    
    return

def scores_to_radius(scores):
    minRad = 4
    maxRad = 30
    minScore = math.sqrt(min(scores)) # Fem us de l'arrel quadrada per normalitzar valors
    maxScore = math.sqrt(max(scores))

    radius = []

    for s in scores:
        s_sqrt = math.sqrt(s)
        tmp = (s_sqrt - minScore)/(maxScore - minScore)
        radius.append(minRad + tmp*(maxRad-minRad))
    
    return radius

