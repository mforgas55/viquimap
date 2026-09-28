# Viquimap

[Viquimap](#Viquimap) és un projecte que té com a objectiu crear (de manera automàtica) un mapa de totes les connexions entre articles de la [Viquipèdia](https://ca.wikipedia.org). Degut a la falta de recursos, no hem publicat el projecte com a pàgina web, sino que hem publicat els passos a seguir per recrear localment el projecte.

## Taula de continguts
- [Instal·lació](#Instal·lació)
- [Conceptes sobre la Viquipèdia](#Conceptes_sobre_la_Viquipèdia)
## Instal·lació
1. Descarregueu el [dump](https://github.com/mforgas55/viquimap/releases/download/DB_DUMP/01_db_dump.sql) de la base de dades i col·loqueu-lo a ```postgres/init/```:
```bash
cd postgres/init/
wget https://github.com/mforgas55/viquimap/releases/download/DB_DUMP/01_db_dump.sql
```
2. Ompliu el .env.example amb les dades que us interessin i renombreu-lo a ```.env```:
```bash
nano .env.example
mv .env.example .env
```
3. Dins de la carpeta root del projecte, inicialitzeu els contenidors (pot trigar uns minuts fins que tots estiguin actius, especialment el de la BD):

```bash
docker compose up --build
```
La web es troba a (http://localhost:8080)

## Conceptes sobre la Viquipèdia
Abans de detallar com crear la base de dades i fer funcionar el projecte, és necessari comprendre com la Viquipèdia categoritza les seves pàgines i fa ús dels redireccionaments. L'objectiu d'aquesta secció és entendre com obtenir un malanomenat "**article real**".

### Pàgines
A la Viquipedia es considera una pàgina tot allò que té contingut i un ID de pàgina (```page_id```). Cada "pàgina" disposa d'un espai de noms (```page_namespace```) que defineix a quin tipus de contingut pertany la pàgina. Així doncs, una pàgina pot ser un article (```page_namespace = 0```), la discussió d'un article (```page_namespace = 1```), un usuari (```page_namespace = 2```), un fitxer (```page_namespace = 6```)... entre d'altres.

El focus del projecte es concentra en crear un mapa amb les conexions entre "**articles reals**".

### Articles redireccionament
Algunes pàgines articles (```page_namespace = 0```) poden ser <em>pàgines redireccionament</em> (```page_is_redirect = 1```). Aquest tipus de pàgines consisteixen en pàgines "buides" que tenen com a instrucció redirigir a una altra pàgina quan són clicades o s'introdueix el seu enllaç. Aixo implica l'existència d'articles que no són "**articles reals**".

Per exemple, una <em>pàgina redireccionament</em> seria: [https://ca.wikipedia.org/wiki/!](https://ca.wikipedia.org/wiki/!). La pàgina redirigeix a "Signe d'exclamació". Si entrem a la [informació de pagina de "!"](https://ca.wikipedia.org/w/index.php?title=!&action=info), veiem que es mostra explícitament a qui referència.

Considerar els redireccionaments dins del graf suposaria la presència d'articles que no aporten cap nova informació, ofuscant el mapa. Per tant, en la creació de la base de dades es necessari descartar aquests articles, guardant únicament els "**articles reals**.

## Backend
El backend està format per dues parts: la base de dades i l'API que la comunica amb el frontend.

### Base de Dades
La creació de la base de dades final parteix de quatre taules ubicades a [Wikimedia Dumps](https://dumps.wikimedia.org/cawiki/).   

Aquestes taules son:
* cawiki-latest-pages-articles.sql.gz
* cawiki-latest-pagelinks.sql.gz
* cawiki-latest-redirect.sql.gz  
* cawiki-latest-linktarget.sql.gz

El flux d'elaboració de la base de dades final consisteix en

### Resolució de redireccionaments


A continuació, cal executar els scripts a [sqlCodes](backend_DB/sqlCodes/) i [graphCalc](backend_DB/graphCalc) per deixar la BD en l'estat que necessita l'aplicació.

### API
Degut a l'alta intensitat de fer una crida fins i tot en una àrea petita del mapa, l'API només retorna els 500 nodes més grans en l'àrea sol·licitada.
Perquè l'API està a l'escolta de qualsevol crida (local) al port 3000



> Made by [Marc](https://github.com/mforgas55) and [Jaume](https://github.com/Jater-exe)