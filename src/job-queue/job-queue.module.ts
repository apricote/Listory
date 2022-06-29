import { Module } from "@nestjs/common";
import { PGBossModule } from "@apricote/nest-pg-boss";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    PGBossModule.forRootAsync({
      application_name: "listory",
      useFactory: (config: ConfigService) => ({
        // Connection details
        host: config.get<string>("DB_HOST"),
        user: config.get<string>("DB_USERNAME"),
        password: config.get<string>("DB_PASSWORD"),
        database: config.get<string>("DB_DATABASE"),
        schema: "public",
        max: config.get<number>("DB_POOL_MAX"),
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [PGBossModule],
})
export class JobQueueModule {}
