# Viquimap

[Viquimap](#Viquimap) és un projecte que té com a objectiu crear (de manera automàtica) un mapa de totes les connexions entre articles de la [Viquipèdia](https://ca.wikipedia.org). Degut a la falta de recursos, no hem publicat el projecte com a pàgina web, sino que hem publicat els passos a seguir per recrear localment el projecte.

## Taula de continguts
- [Instal·lació](#Instal·lació)
- [Funcionament](#Funcionament)
## Instal·lació
1. Descarregueu el [dump](https://github.com/mforgas55/viquimap/releases/download/DB_DUMP/01_db_dump.sql) de la base de dades i col·loqueu-lo a ```postgres/init/``` [NO ALTEREU EL NOM]:
```bash
cd postgres/init/
wget https://github.com/mforgas55/viquimap/releases/download/DB_DUMP/01_db_dump.sql
```
2. Ompliu el .env.example amb les dades que us interessin i renombreu-lo a ```.env```:
```bash
nano .env.example
mv .env.example .env
```
3. Dins de la carpeta root del projecte, inicialitzeu els contenidors:

```bash
docker compose up --build
```


> Made by [Marc](https://github.com/mforgas55) and [Jaume](https://github.com/Jater-exe)