import { AppDataSource } from "./data-source";
import * as express from "express";
import * as http from 'http';
import * as cors from 'cors';
import { json } from 'body-parser';
import { buildSchema } from "type-graphql";
import { ApolloServer } from "@apollo/server";
import { AuthenticationResolver } from "./resolvers/AuthenticationResolver";
import { expressMiddleware } from '@apollo/server/express4';
import * as dotenv from "dotenv";
import { PostResolver } from "./resolvers/PostResolver";
// import { ApolloServerLoaderPlugin } from "type-graphql-dataloader";
// import { getConnection } from "typeorm";
dotenv.config();

AppDataSource.initialize().then(async () => {
  const app = express()
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [AuthenticationResolver, PostResolver]
    }),
    // plugins: [
    //   ApolloServerLoaderPlugin({
    //     typeormGetConnection: getConnection,
    //   }),
    // ],
  });
  await server.start();
  
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    }),
  );
  
  await new Promise<void>((resolve) => httpServer.listen({ port: process.env.PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${process.env.PORT}/graphql`);

})