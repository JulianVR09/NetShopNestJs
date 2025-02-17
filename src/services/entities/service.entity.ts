import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  image: string;

  @Column()
  studies: string;

  @Column()
  HV: string;

  @ManyToOne(() => User, (user) => user.services)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;
}
