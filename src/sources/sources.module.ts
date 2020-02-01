import { Module } from '@nestjs/common';
import { SpotifyModule } from './spotify/spotify.module';

@Module({
  imports: [SpotifyModule]
})
export class SourcesModule {}
