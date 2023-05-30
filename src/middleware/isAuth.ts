import { GraphQLError } from "graphql";
import { verify, JwtPayload } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";

export const isAuth: MiddlewareFn<JwtPayload> = async ({ context }, next) => {
  try {
    let decoded = verify(context.token, process.env.JWT_SECRET) as JwtPayload;
    context.jwtDecoded = decoded;
  } catch (error) {
    throw new GraphQLError(error.message, {
      extensions: {
        code: error.name,
      },
    });
  }

  return next();
}