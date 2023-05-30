import { Field, ID, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from "typeorm"

@ObjectType()
@Entity({name: "post_files"})
export class PostFile extends BaseEntity {

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  filename: string

  @Field()
  @Column()
  mimetype: string

  @Field()
  @Column()
  encoding: string

  @Field()
  @Column()
  path: string
}