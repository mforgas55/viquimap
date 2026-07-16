import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class NodeResponseDto {
  pageId: number;
  title: string;
  position: string;
  node_radius: number;
}

export class EdgeResponseDto {
  sourceId: number;
  targetId: number;
}

export interface BboxResult {
  nodesBBox: NodeResponseDto[];
  edges: EdgeResponseDto[];
  outlyingNodes: NodeResponseDto[];
}

export class BboxQueryDto {
  @Type(() => Number)
  @IsNumber()
  xmin: number;

  @Type(() => Number)
  @IsNumber()
  xmax: number;

  @Type(() => Number)
  @IsNumber()
  ymin: number;

  @Type(() => Number)
  @IsNumber()
  ymax: number;
}
