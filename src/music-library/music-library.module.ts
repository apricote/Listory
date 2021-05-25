import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AlbumRepository } from "./album.repository";
import { ArtistRepository } from "./artist.repository";
import { GenreRepository } from "./genre.repository";
import { MusicLibraryService } from "./music-library.service";
import { TrackRepository } from "./track.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AlbumRepository,
      ArtistRepository,
      GenreRepository,
      TrackRepository,
    ]),
  ],
  providers: [MusicLibraryService],
  exports: [MusicLibraryService],
})
export class MusicLibraryModule {}
