import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database/database.module";
import { ListensModule } from "./listens/listens.module";
import { LoggerModule } from "./logger/logger.module";
import { MusicLibraryModule } from "./music-library/music-library.module";
import { SourcesModule } from "./sources/sources.module";
import { UsersModule } from "./users/users.module";
import { ConfigModule } from "./config/config.module";
import { HealthCheckModule } from "./health-check/health-check.module";
import { ReportsModule } from "./reports/reports.module";

@Module({
  imports: [
    LoggerModule,
    ConfigModule,
    DatabaseModule,
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "static"),
      exclude: ["/api*"],
    }),
    AuthModule,
    UsersModule,
    SourcesModule,
    MusicLibraryModule,
    ListensModule,
    HealthCheckModule,
    ReportsModule,
  ],
})
export class AppModule {}
