import { Entity, PrimaryColumn } from 'typeorm';

@Entity('edges')
export class Edge {
  @PrimaryColumn()
  idsourcenode: number;

  @PrimaryColumn()
  idtargetnode: number;
}