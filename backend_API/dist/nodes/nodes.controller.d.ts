import { NodesService } from './nodes.service';
import { BboxQueryDto, BboxResult } from './dto/bbox-query.dto';
export declare class NodesController {
    private readonly nodesService;
    constructor(nodesService: NodesService);
    getByBbox(query: BboxQueryDto): Promise<BboxResult>;
}
