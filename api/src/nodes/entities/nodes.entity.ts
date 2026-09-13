import { Entity, PrimaryColumn, Column, Index } from 'typeorm';

@Entity('nodes')
export class Node {
  @PrimaryColumn({name: 'page_id'})
  id: number;
  @Column({name: 'page_title'})
  title: string;
  @Column({type: 'float'})
  pagerank: number;
  @Column({type:'float'})
  node_radius: number;
  @Index({ spatial: true })
  @Column({ type: 'geometry', spatialFeatureType: 'point'})
  position: string;
} 