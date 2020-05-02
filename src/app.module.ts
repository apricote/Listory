import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database/database.module";
import { ListensModule } from "./listens/listens.module";
import { MusicLibraryModule } from "./music-library/music-library.module";
import { SourcesModule } from "./sources/sources.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    AuthModule,
    UsersModule,
    SourcesModule,
    MusicLibraryModule,
    ListensModule,
  ],
})
export class AppModule {}
