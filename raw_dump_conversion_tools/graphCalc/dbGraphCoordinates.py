import networkit
import igraph
import csv
import json
from psycopg2.extras import execute_values

coord_csv_path = "./data/coord/coordinates_raw.csv"

def calculateCoordinates():
    ruta_fitxer = "./data/graphs/mainCCv0.nkb"
    # Obrir la c.c, els nodes isolats els hi assignarem coordenades arbitraries per a que no estiguin lluny
    G = networkit.graphio.readGraph(ruta_fitxer, networkit.Format.NetworkitBinary)
    with open("./data/maps/mapNodesMainCC.json", "r") as f:
        mapNodesMainCC = json.load(f) # Recordem que es page_id -> node_id en el graf
    
    # json converteix les keys a strings, cal recuperar page_id com a int
    mapNodesMainCC = {int(page_id): id_graf for page_id, id_graf in mapNodesMainCC.items()} # Un objecte JSON es un {"key": value}
    mapNodeToPage = {id_graf: page_id for page_id, id_graf in mapNodesMainCC.items()}
    
    g_size = G.numberOfNodes()
    print("Inicialitzant graf en igraph...")
    g_ig = igraph.Graph(n=g_size, directed=G.isDirected())

    print("Transferint arestes al nou graf igraph...")
    # G_nk.iterEdges() es un iterador al inici de la llista d'adjacencies. add_edges() de igraph sap llegirho
    g_ig.add_edges(G.iterEdges())

    del G # Alliberem memoria trient el graf de networkit
    print("Conversio completa")

    # CALCULAR EL LAYOUT DRL
    print("Calcul coordenades...")
    try:
        # Aquí comprobamos que layout_drl compile y no pida parámetros inválidos
        layout = g_ig.layout_drl()
        print("Fet!")
    except Exception as e:
        print(f"ERROR Critic en DrL: {e}")
        return

    print(f"Guardant resultats en '{coord_csv_path}'...")

    with open(coord_csv_path, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        # Escribim capçaleres
        writer.writerow(["page_id", "x", "y"])
        
        # Escribim dades de manera eficient
        for internal_id in range(g_size):
            page_id = mapNodeToPage[internal_id]
            x, y = layout[internal_id]
            writer.writerow([page_id, float(x), float(y)])

    print(f"Arxiu guardat")
    return


def uploadCoordinates(conn):
    dataToUpload = []
    with open('./data/coord/coordinates_raw.csv', mode='r') as f:
        lect = csv.DictReader(f)  # Detecta automàticament les capçaleres
        for row in lect:
            page_id = int(row['page_id'])
            x = float(row['x'])
            y = float(row['y'])
            dataToUpload.append((page_id, x, y))
    
    cur = conn.cursor()

    query = """
        UPDATE nodes AS n
        SET position = ST_SetSRID(ST_MakePoint(dn.x, dn.y), 0)
        FROM (VALUES %s) AS dn(page_id, x, y)
        WHERE n.page_id = dn.page_id;
    """
    # Les nostres tuples tenen (int, float, float), que es corresponen amb (page_id, x, y)
    template = "(%s, %s, %s)"
    print("Actualitzant coordenades...")
    execute_values(cur, query, dataToUpload, template=template, page_size=10000) 
    cur.close()
    conn.commit()

def setCoordinates(conn):
    calculateCoordinates()
    uploadCoordinates(conn)
    




