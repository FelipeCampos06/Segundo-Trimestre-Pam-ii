import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Mesa } from '../../mesa/entities/mesa.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { ComandaItem } from '../../comanda-item/entities/comanda-item.entity';

@Entity('comandas')
export class Comanda {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  id_mesa: number;

  @Column({ type: 'int', nullable: true })
  id_usuario: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  obs_comanda: string;

  @ManyToOne(() => Mesa)
  @JoinColumn({ name: 'id_mesa' })
  mesa: Mesa;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @OneToMany(() => ComandaItem, (comandaItem) => comandaItem.comanda, {
    cascade: true,
  })
  itens: ComandaItem[];
}
