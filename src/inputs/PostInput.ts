import { Length, IsNotEmpty } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class PostInput {
  @Field()
  @Length(1, 255)
  title: string;

  @Field()
  @IsNotEmpty()
  body: string;

}