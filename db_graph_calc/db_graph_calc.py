import networkit
from db_connection import get_connection



def create_graph():
    conn = get_connection()
    if conn:
        print("Connection to the PostgreSQL established successfully.")
    else:
        print("Connection to the PostgreSQL encountered and error.")
    
    cur = conn.cursor() # El cursor es qui envia ordres i rep dades de la DB
    cur.execute("SELECT id FROM nodes;")

    allNodes = cur.fetchall()

    size = cur.rowcount
    G = networkit.graph.Graph(n=size, weighted=False, directed=True) # Creem graf, on ja te els n vertexs sense adjacencies numerats de 0 a n-1

    queryGetEdges = "SELECT idTargetNode FROM edges WHERE idSourceNode = %s;"
    #Ara iterem sobre cada node, es molt important que id_node sigui igual a la iteracio i, perque sino estem associant a un node erroni
    for node in allNodes:
        cur.execute(queryGetEdges, (node,))
        allEdgesFromThisNode = cur.fetchall()
        for edge in allEdgesFromThisNode:
            G.addEdge(node, edge) # Per com esta disenyat tot, es impossible que dos arestes siguin identiques (donant lloc a multiaresta)


def calculate_PageRank():
    
    return


def calculat_coordinates():
    return

create_graph()