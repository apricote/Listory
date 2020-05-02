import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";

// tslint:disable-next-line variable-name
export const DatabaseModule = TypeOrmModule.forRootAsync({
  useFactory: (config: ConfigService) => ({
    type: "postgres",

    // Connection details
    host: config.get<string>("DB_HOST"),
    username: config.get<string>("DB_USERNAME"),
    password: config.get<string>("DB_PASSWORD"),
    database: config.get<string>("DB_DATABASE"),

    // Entities
    entities: [join(__dirname, "..", "**/*.entity.{ts,js}")],

    // Migrations
    // migrationsRun: true,
    // migrations: [join(__dirname, "migrations", "*.{ts,js}")],
    synchronize: true,
  }),
  inject: [ConfigService],
});
