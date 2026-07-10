export declare class NodeResponseDto {
    pageId: number;
    title: string;
    geopoint: string;
}
export declare class EdgeResponseDto {
    sourceId: number;
    targetId: number;
}
export interface BboxResult {
    nodes: NodeResponseDto[];
    edges: EdgeResponseDto[];
}
export declare class BboxQueryDto {
    xmin: number;
    xmax: number;
    ymin: number;
    ymax: number;
}
