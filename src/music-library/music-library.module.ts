import { Module } from "@nestjs/common";
import { TypeOrmRepositoryModule } from "../database/entity-repository/typeorm-repository.module";
import { AlbumRepository } from "./album.repository";
import { ArtistRepository } from "./artist.repository";
import { GenreRepository } from "./genre.repository";
import { MusicLibraryService } from "./music-library.service";
import { TrackRepository } from "./track.repository";

@Module({
  imports: [
    TypeOrmRepositoryModule.for([
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
