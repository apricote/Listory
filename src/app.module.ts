import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { ServeStaticModule } from "@nestjs/serve-static";
import { RavenModule } from "nest-raven";
import { join } from "path";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "./config/config.module";
import { DatabaseModule } from "./database/database.module";
import { HealthCheckModule } from "./health-check/health-check.module";
import { ListensModule } from "./listens/listens.module";
import { LoggerModule } from "./logger/logger.module";
import { MetricsModule } from "./metrics/metrics.module";
import { MusicLibraryModule } from "./music-library/music-library.module";
import { ReportsModule } from "./reports/reports.module";
import { SourcesModule } from "./sources/sources.module";
import { UsersModule } from "./users/users.module";

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
    RavenModule,
    MetricsModule.forRoot(),
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
