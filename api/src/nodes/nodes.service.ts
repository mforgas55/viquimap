import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Repository } from 'typeorm';
import { Node } from './entities/nodes.entity';
import { BboxQueryDto, NodeResponseDto, EdgeResponseDto, BboxResult } from './dto/bbox-query.dto';

const query_limit: number = 500;

interface NodeRow {
  page_id: number;
  page_title: string;
  //pagerank_raw: number;
  node_radius: number;
  position: string;
}

interface EdgeRow {
  idsourcenode: number;
  idtargetnode: number;
}

@Injectable()
export class NodesService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findInBbox(dto: BboxQueryDto): Promise<BboxResult> {
    const { xmin, xmax, ymin, ymax } = dto;

    const envelope = `ST_MakeEnvelope($1, $2, $3, $4, 0)`;
    // SRID 0 for canvas/pixel coordinates; use 4326 for geographic

    const nodeRows = await this.dataSource.query<NodeRow[]>(
      `SELECT page_id, convert_from(page_title, 'UTF8') AS page_title, node_radius, ST_AsText(position) AS position
        FROM nodes
        WHERE position && ${envelope}
        order by node_radius
        limit ${query_limit}`,
      [xmin, ymin, xmax, ymax],
    );

    const nodesBBox = nodeRows.map((row) => ({
      pageId: row.page_id,
      title: row.page_title,
      //pagerank: row.pagerank_raw,
      node_radius: row.node_radius,
      position: row.position,
    }));

    const nodeIds = nodesBBox.map((node) => node.pageId);

    const edgeRows =
      nodeIds.length === 0
        ? []
        : await this.dataSource.query<EdgeRow[]>(
            `
        SELECT idsourcenode, idtargetnode
        FROM edges
        WHERE (idsourcenode = ANY($1)
          OR idtargetnode = ANY($1))
        `,
            [nodeIds],
          );

    const edges = edgeRows.map((row) => ({
      sourceId: Number(row.idsourcenode),
      targetId: Number(row.idtargetnode),
    }));

    const sourceIds = edges.map((e) => e.sourceId);
    const targetIds = edges.map((e) => e.targetId);

    const notVisiblesNodesRows =
      nodeIds.length === 0
        ? []
        : await this.dataSource.query<NodeRow[]>(
            `
        SELECT page_id, convert_from(page_title, 'UTF8') AS page_title, node_radius, ST_AsText(position) AS position
        FROM nodes
        WHERE (page_id = ANY($1)
          OR page_id = ANY($2)) AND page_id != ALL($3)
        LIMIT ${query_limit}
        `,
            [sourceIds, targetIds, nodeIds],
          );

    const outlyingNodes = notVisiblesNodesRows.map((row) => ({
      pageId: row.page_id,
      title: row.page_title,
      //pagerank: row.pagerank_raw,
      node_radius: row.node_radius,
      position: row.position,
    }));
    return { nodesBBox, edges, outlyingNodes };
  }
}
