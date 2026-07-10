-- Previament es necessita la taula page

CREATE TABLE real_pages AS SELECT page_id, page_title FROM page WHERE page_namespace = 0 AND page_is_redirect = 0; 
