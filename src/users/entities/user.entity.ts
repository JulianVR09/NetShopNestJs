import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Role } from '../../common/enums/role.enum';
import { Order } from '../../order/entities/order.entity';
import { Product } from '../../products/entities/product.entity';
import { Service } from '../../services/entities/service.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @Column({ unique: true, nullable: true })
  phoneNumber?: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ select: false, nullable: false })
  password: string;

  @Column({ type: 'enum', default: Role.USER, enum: Role })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Service, (service) => service.user)
  services: Service[];
}
