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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;
const typeorm_1 = require("typeorm");
let Node = class Node {
    id;
    title;
    pagerank;
    node_radius;
    position;
};
exports.Node = Node;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'page_id ' }),
    __metadata("design:type", Number)
], Node.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'page_title' }),
    __metadata("design:type", String)
], Node.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], Node.prototype, "pagerank", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], Node.prototype, "node_radius", void 0);
__decorate([
    (0, typeorm_1.Index)({ spatial: true }),
    (0, typeorm_1.Column)({ type: 'geometry', spatialFeatureType: 'point' }),
    __metadata("design:type", String)
], Node.prototype, "position", void 0);
exports.Node = Node = __decorate([
    (0, typeorm_1.Entity)('nodes')
], Node);
//# sourceMappingURL=nodes.entity.js.map