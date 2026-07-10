import { DataSource } from 'typeorm';
import { BboxQueryDto, BboxResult } from './dto/bbox-query.dto';
export declare class NodesService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    findInBbox(dto: BboxQueryDto): Promise<BboxResult>;
}
