import { Controller, Get, Query } from '@nestjs/common';
import { NodesService } from './nodes.service';
import { BboxQueryDto, BboxResult } from './dto/bbox-query.dto';

@Controller('nodes')
export class NodesController {
  constructor(private readonly nodesService: NodesService) {}

  @Get()
  async getByBbox(@Query() query: BboxQueryDto): Promise<BboxResult> {
    return this.nodesService.findInBbox(query);
  }
}