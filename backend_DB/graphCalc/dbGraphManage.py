from dbConnection import get_connection
from dbGraphCreate import createGraph
from dbGraphPageRank import setPageRank
from dbGraphCoordinates import setCoordinates

conn = get_connection()
if conn:
    print("Connection to the PostgreSQL established successfully.")
else:
    print("Connection to the PostgreSQL encountered and error.")
    exit(1)  # surt immediatament amb codi d'error, no continua
    
try:
    createGraph(conn) # Crea el graf principal i la principal component conexa, guardant mapejos i grafs a disc
    setPageRank(conn)
    setCoordinates(conn)
except Exception as e: # En el cas de que alguna cosa falli en el proces, ens permet no fotre la BD i acabar tencant be la conexio sense deixarla oberta
    print(f"Error durant el processament del graf: {e}")
    conn.rollback()  # neteja qualsevol transacció a mitges
    raise  
finally:
    conn.close()
    print("Connexió tancada.")
