import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class NodeResponseDto {
  pageId: number;
  title: string;
  geopoint: string;
}

export class EdgeResponseDto {
  sourceId: number;
  targetId: number;
}

export interface BboxResult {
  nodes: NodeResponseDto[];
  edges: EdgeResponseDto[];
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