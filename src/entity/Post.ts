import { Field, ID, ObjectType } from "type-graphql"
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from "typeorm"
import { User } from "./User"
// import { TypeormLoader } from "type-graphql-dataloader"

@ObjectType()
@Entity({name: "posts"})
export class Post extends BaseEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number

    @Field()
    @Column()
    title: string

    @Field()
    @Column()
    body: string

    @Field()
    @Column('varchar', { unique: true, length: 255 })
    slug: string

    @Field(() => User, { nullable: true })
    @ManyToOne(() => User, user => user.posts)
    // @TypeormLoader()
    user: User
}
