import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthenticationModule } from "./authentication/authentication.module";
import { DatabaseModule } from "./database/database.module";
import { ConnectionsModule } from "./connections/connections.module";
import { FrontendModule } from './frontend/frontend.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthenticationModule,
    ConnectionsModule,
    FrontendModule
  ]
})
export class AppModule {}
