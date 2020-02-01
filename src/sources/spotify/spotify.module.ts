import { Module } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { SpotifyApiModule } from './spotify-api/spotify-api.module';

@Module({
  providers: [SpotifyService],
  imports: [SpotifyApiModule]
})
export class SpotifyModule {}
