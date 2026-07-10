"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const query_limit = 500;
let NodesService = class NodesService {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async findInBbox(dto) {
        const { xmin, xmax, ymin, ymax } = dto;
        const envelope = `ST_MakeEnvelope($1, $2, $3, $4, 0)`;
        const nodes = (await this.dataSource.query(`SELECT page_id, page_title, pagerank_raw, node_radius, ST_AsText(position) AS position
        FROM nodes
        WHERE position && ${envelope}
        order by node_radius
        limit ${query_limit}`, [xmin, ymin, xmax, ymax])).map(row => ({
            pageId: row.page_id,
            title: row.page_title,
            pagerank: row.pagerank_raw,
            node_radius: row.node_radius,
            position: row.position,
        }));
        const nodeIds = nodes.map(node => node.pageId);
        const edges = nodeIds.length === 0
            ? []
            : (await this.dataSource.query(`
        SELECT idsourcenode AS sourceid, idtargetnode AS targetid
        FROM edges
        WHERE idsourcenode = ANY($1)
          OR idtargetnode = ANY($1)
        `, [nodeIds])).map(row => ({
                sourceId: Number(row.sourceid),
                targetId: Number(row.targetid),
            }));
        return { nodes, edges };
    }
};
exports.NodesService = NodesService;
exports.NodesService = NodesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], NodesService);
//# sourceMappingURL=nodes.service.js.map