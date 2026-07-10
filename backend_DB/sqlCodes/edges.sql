-- Previament es necessiten les taules redirect_map, pagelinks, linktarget, page i nodes

CREATE TABLE edges AS
SELECT DISTINCT
    pl.pl_from                                  AS idsourcenode,
    COALESCE(rm.dest_page_id, p_dest.page_id)  AS idtargetnode
FROM pagelinks pl

JOIN linktarget lt
    ON lt.lt_id         = pl.pl_target_id
    AND lt.lt_namespace  = 0

JOIN page p_dest
    ON p_dest.page_title      = lt.lt_title
    AND p_dest.page_namespace  = 0

LEFT JOIN redirect_map rm
    ON rm.redirect_page_id = p_dest.page_id

-- Source ha de existir a nodes
JOIN nodes n_src
    ON n_src.page_id = pl.pl_from

-- Target final ha de existir a nodes
JOIN nodes n_dst
    ON n_dst.page_id = COALESCE(rm.dest_page_id, p_dest.page_id)

WHERE pl.pl_from_namespace = 0
  AND pl.pl_from != COALESCE(rm.dest_page_id, p_dest.page_id);

CREATE INDEX idx_edges_source ON edges(idsourcenode);
CREATE INDEX idx_edges_target ON edges(idtargetnode);