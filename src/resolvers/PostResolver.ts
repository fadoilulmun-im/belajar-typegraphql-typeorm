import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Post } from "../entity/Post";
import { isAuth } from "../middleware/isAuth";
import { User } from "../entity/User";
import { PostInput } from "../inputs/PostInput";
import * as slug from "slug";
import { GraphQLError } from "graphql";

@Resolver()
export class PostResolver{
  @Query(() => [Post])
  async posts(): Promise<Post[]>{
    return Post.find({ relations: ["user"] });
  }
  
  @Query(() => Post)
  async post(
    @Arg('slug') slug: string,
  ): Promise<Post>{
    const post = await Post.findOne({where: {slug: slug}, relations: ["user"]});

    if(!post){
      throw new GraphQLError('Data not found', {
        extensions: {
          code: 'BAD_USER_INPUT',
          argumentName: 'slug',
        },
      });
    }

    return post;
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async create(
    @Ctx() ctx: any,
    @Arg('input') {title, body}: PostInput,  
  ){
    const user = await User.findOne({where: {id: ctx.jwtDecoded.id}});
    return Post.create({title: title, body: body, slug: slug(title), user}).save();
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async update(
    @Arg('id') id: number,
    @Arg('input') {title, body}: PostInput,
  ){
    const post = await Post.findOne({where: {id: id}, relations: ["user"] });

    if(!post){
      throw new GraphQLError('Data not found', {
        extensions: {
          code: 'BAD_USER_INPUT',
          argumentName: 'id',
        },
      });
    }

    post.title = title;
    post.body = body;
    post.slug = slug(title);
    return post.save();
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async delete(
    @Arg('id') id: number,
  ){
    const post = await Post.findOne({where: {id: id}});

    if(!post){
      throw new GraphQLError('Data not found', {
        extensions: {
          code: 'BAD_USER_INPUT',
          argumentName: 'id',
        },
      });
    }

    await Post.delete({id: id});
    return true;
  }
}