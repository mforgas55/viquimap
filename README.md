# Viquimap

[Viquimap](#Viquimap) és un projecte que té com a objectiu crear (de manera automàtica) un mapa de totes les connexions entre articles de la [Viquipèdia](https://ca.wikipedia.org). Degut a la falta de recursos, no hem publicat el projecte com a pàgina web, sino que hem publicat els passos a seguir per recrear localment el projecte.


## Taula de continguts
- [Backend](#backend)
- [Frontend](#frontend)


## Backend
El backend està format per dues parts: la base de dades i l'API la comunica amb el frontend
### Base de Dades
Inicialment, ha de contenir tres taules, totes obtingudes de [Wikimedia Dumps](https://dumps.wikimedia.org/cawiki/). Cal descarregar els fitxers cawiki-[...]-pages-articles.xml.bz2, cawiki-[...]-linktarget.xml.bz2 i cawiki-[...]-pagelinks.xml.bz2, muntar les BDs i passar-les a PostgreSQL. A continuació, cal executar els scripts a [sqlCodes](backend_DB/sqlCodes/) i [graphCalc](backend_DB/graphCalc) per deixar la BD en l'estat que necessita l'aplicació.

### API
Degut a l'alta intensitat de fer una crida fins i tot a una àrea petita del mapa, l'API només retorna els 500 nodes més grans en l'àrea sol·licitada. Per fer-la funcionar, cal crear un document .env a [backend_API](backend_API) i omplir-hi els camps següents:
```bash
    DBPORT=
    DBUSERNAME=
    DBPASSWORD=
    DBNAME=
```

Finalment cal executar al terminal
```bash
    npm run dev
```
Perquè l'API estigui a l'escolta de qualsevol crida (local) al port 3000

## Frontend
Per executar el frontend, cal tenir la BD i l'API actives i a la mateixa xarxa, si no, no podrà fer crides a l'API, i aquesta no podrà llegir la BD. Simplement cal executar
```
    npm run dev
```
I obrir l'app al navegador, cosa que activarà automàticament les crides a l'API.

---

> Made by [Marc](https://github.com/mforgas55) and [Jaume](https://github.com/Jater-exe)