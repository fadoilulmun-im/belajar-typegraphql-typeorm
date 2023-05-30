import { Resolver, Mutation, Arg, Query, Ctx, UseMiddleware } from "type-graphql";
import { User } from "../entity/User";
import * as bcrypt from "bcryptjs";
import { RegisterInput } from "../inputs/RegisterInput";
import { GraphQLError } from "graphql";
import * as jwt from "jsonwebtoken";
import { isAuth } from "../middleware/isAuth";

@Resolver()
export class AuthenticationResolver {
  @Query(() => User)
  @UseMiddleware(isAuth)
  async me(@Ctx() ctx: any){

    const user = await User.findOne({where: {id: ctx.jwtDecoded.id}, relations: ["posts"] });

    return user;
  }

  @Mutation(() => User)
  async register(
    @Arg('input') { firstName, lastName, email, password }: RegisterInput
  ): Promise<User>{
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    }).save();

    return user;
  }

  @Mutation(() => String)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<String | GraphQLError>{
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new GraphQLError('Error signing in', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }
    
    const valid = await bcrypt.compare(password, user.password);
    
    if (!valid) {
      throw new GraphQLError('Error signing in', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }

    return jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  }

  // @Mutation(() => Boolean)
  // @UseMiddleware(isAuth)
  // async logout(@Ctx() ctx: any): Promise<Boolean>{
  //   try {
  //     const token = jwt.sign({id: ctx.jwtDecoded.id}, process.env.JWT_SECRET, { expiresIn: '1ms' });
      
  //     return true;
  //   } catch (error) {
  //     throw new GraphQLError(error.message, {
  //       extensions: {
  //         code: error.name,
  //       },
  //     });
  //   }
  // }
}