# Viquimap

[Viquimap](#Viquimap) és un projecte que té com a objectiu crear (de manera automàtica) un mapa de totes les connexions entre articles de la [Viquipèdia](https://ca.wikipedia.org). Degut a la falta de recursos, no hem publicat el projecte com a pàgina web, sino que hem publicat els passos a seguir per recrear localment el projecte.


## Taula de continguts
- [Conceptes sobre la Viquipèdia](#conceptes_sobre_la_viquipedia)
- [Backend](#backend)
- [Frontend](#frontend)

## Conceptes sobre la Viquipèdia
Abans de detallar com crear la base de dades i fer funcionar el projecte, es necessari comprendre com la Viquipedia categoritza les seves pagines i fa us dels redireccionaments. L'objectiu d'aquesta seccio es entendre com obtenir un malanomenat "**article real**".

### Pagines
A la Viquipedia es considera una pagina tot allo que te contingut i un ID de pagina (```page_id```). Cada "pagina" disposa d'un espai de noms (```page_namespace```) que defineix a quin tipus de contingut pertany la pagina. Aixi doncs, una pagina pot ser un article (```page_namespace = 0```), la discusio d'un article (```page_namespace = 1```), un usuari (```page_namespace = 2```), un fitxer (```page_namespace = 6```)... entre d'altres.

El focus del projecte es concentra en crear un mapa amb les conexions entre "**articles reals**".

### Articles redireccionament
Algunes pagines articles (```page_namespace = 0```) poden ser <em>pagines redireccionament</em> (```page_is_redirect = 1```). Aquest tipus de pagines consisteixen en pagines "buides" que tenen com a instruccio redirigir a una altre pagina quan son clicades o s'introdueix el seu enllaç. Aixo implica l'existencia d'articles que no son "**articles reals**".

Per exemple, una <em>pagina redireccionament</em> seria: [https://ca.wikipedia.org/wiki/!](https://ca.wikipedia.org/wiki/!). La pagina redirigeix a "Signe d'exclamació". Si entrem a la [informació de pagina de "!"](https://ca.wikipedia.org/w/index.php?title=!&action=info), veiem que es mostra explicitament a qui referencia.

Considerar els redireccionaments dins del graf suposaria la presencia d'articles que no aporten cap nova informacio, ofuscant el mapa. Per tant, en la creacio de la base de dades es necessari descartar aquests articles, guardant unicament els "**articles reals**.

## Backend
El backend està format per dues parts: la base de dades i l'API la comunica amb el frontend.

### Base de Dades
La creacio de la base de dades final parteix de quatre taules ubicades a [Wikimedia Dumps](https://dumps.wikimedia.org/cawiki/).   

Aquestes taules son:
* cawiki-latest-pages-articles.sql.gz
* cawiki-latest-pagelinks.sql.gz
* cawiki-latest-redirect.sql.gz  
* cawiki-latest-linktarget.sql.gz

El flux d'elaboracio de la base de dades final consisteix en

### Resolucio de redireccionaments


A continuació, cal executar els scripts a [sqlCodes](backend_DB/sqlCodes/) i [graphCalc](backend_DB/graphCalc) per deixar la BD en l'estat que necessita l'aplicació.

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
