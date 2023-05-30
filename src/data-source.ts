import "reflect-metadata"
import { DataSource } from "typeorm"
import { Post } from "./entity/Post"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "MyProject-typegraphql",
    synchronize: false,
    logging: false,
    entities: [User, Post],
    migrations: [],
    subscribers: [],
})
