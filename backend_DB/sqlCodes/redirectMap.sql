-- Previament es necessita la taula redirect i page

CREATE TABLE redirect_map AS
WITH RECURSIVE resolved AS (

    -- CAS BASE
    SELECT
        r.rd_from                AS redirect_page_id,
        p_dest.page_id           AS dest_page_id,
        p_dest.page_is_redirect  AS still_redirect,
        1                        AS depth
    FROM redirect r
    JOIN page p_dest
        ON p_dest.page_title       = r.rd_title
        AND p_dest.page_namespace  = r.rd_namespace
        AND p_dest.page_is_redirect = 0          -- ← evita agafar el duplicat redirect
    WHERE r.rd_from != p_dest.page_id            -- ← evita auto-referències

    UNION ALL

    -- CAS RECURSIU
    SELECT
        resolved.redirect_page_id,
        p_next.page_id,
        p_next.page_is_redirect,
        resolved.depth + 1
    FROM resolved
    JOIN redirect r2
        ON r2.rd_from = resolved.dest_page_id
    JOIN page p_next
        ON p_next.page_title       = r2.rd_title
        AND p_next.page_namespace  = 0
        AND p_next.page_is_redirect = 0          -- ← igual aquí
    WHERE resolved.still_redirect = 1
      AND resolved.depth < 10
      AND p_next.page_id != resolved.redirect_page_id  -- ← evita tornar a l'origen

)

SELECT
    redirect_page_id,
    dest_page_id
FROM resolved
WHERE still_redirect = 0;

CREATE INDEX idx_redirect_map ON redirect_map(redirect_page_id);