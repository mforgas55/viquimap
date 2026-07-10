import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Repository } from 'typeorm';
import { Node } from './entities/nodes.entity';
import { BboxQueryDto, NodeResponseDto, EdgeResponseDto, BboxResult } from './dto/bbox-query.dto';

const query_limit: number = 500;

@Injectable()
export class NodesService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findInBbox(dto: BboxQueryDto): Promise<BboxResult> {
    const { xmin, xmax, ymin, ymax } = dto;

    const envelope = `ST_MakeEnvelope($1, $2, $3, $4, 0)`;
    // SRID 0 for canvas/pixel coordinates; use 4326 for geographic

    const nodes = (await this.dataSource.query(
        `SELECT page_id, page_title, pagerank_raw, node_radius, ST_AsText(position) AS position
        FROM nodes
        WHERE position && ${envelope}
        order by node_radius
        limit ${query_limit}`,
        [xmin, ymin, xmax, ymax],)
      ).map(row => ({
        pageId: row.page_id,
        title: row.page_title,
        pagerank: row.pagerank_raw,
        node_radius: row.node_radius,
        position: row.position,
    }));

    const nodeIds = nodes.map(node => node.pageId);

    const edges = nodeIds.length === 0
      ? []
      : (await this.dataSource.query(
        `
        SELECT idsourcenode AS sourceid, idtargetnode AS targetid
        FROM edges
        WHERE idsourcenode = ANY($1)
          OR idtargetnode = ANY($1)
        `,
        [nodeIds],
      )).map(row => ({
        sourceId: Number(row.sourceid),
        targetId: Number(row.targetid),
      }));

    return { nodes, edges };
  }
}