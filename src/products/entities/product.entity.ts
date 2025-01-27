import { Category } from "src/common/enums/categories.enum";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({nullable: true})
    description: string;

    @Column({nullable: false})
    price: number;

    @Column()
    stock: number;

    @Column()
    location: string;

    @Column()
    image: string;

    @Column({type: 'enum', enum: Category, default:Category.OTHER})
    category: Category;

    @ManyToOne(() => User, (user) => user.products)
    @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
    user: User;
}
