import { Field, ID, ObjectType } from "type-graphql"
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm"
import { Post } from "./Post"
// import { TypeormLoader } from "type-graphql-dataloader"

@ObjectType()
@Entity({ name: "users"})
export class User extends BaseEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number

    @Field()
    @Column()
    firstName: string

    @Field()
    @Column()
    lastName: string

    @Field()
    @Column('varchar', { unique: true, length: 100 })
    email: string

    @Column()
    password: string

    @OneToMany(() => Post, post => post.user)
    @Field(() => [Post], { nullable: true })
    // @TypeormLoader()
    posts: Post[]
}
