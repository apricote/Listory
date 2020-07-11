import { Injectable } from "@nestjs/common";
import { Album } from "./album.entity";
import { AlbumRepository } from "./album.repository";
import { Artist } from "./artist.entity";
import { ArtistRepository } from "./artist.repository";
import { CreateAlbumDto } from "./dto/create-album.dto";
import { CreateArtistDto } from "./dto/create-artist.dto";
import { CreateTrackDto } from "./dto/create-track.dto";
import { FindAlbumDto } from "./dto/find-album.dto";
import { FindArtistDto } from "./dto/find-artist.dto";
import { FindTrackDto } from "./dto/find-track.dto";
import { Track } from "./track.entity";
import { TrackRepository } from "./track.repository";

@Injectable()
export class MusicLibraryService {
  constructor(
    private readonly albumRepository: AlbumRepository,
    private readonly artistRepository: ArtistRepository,
    private readonly trackRepository: TrackRepository
  ) {}

  async findArtist(query: FindArtistDto): Promise<Artist | undefined> {
    return this.artistRepository.findOne({
      where: { spotify: { id: query.spotify.id } },
    });
  }

  async createArtist(data: CreateArtistDto): Promise<Artist> {
    const artist = this.artistRepository.create();

    artist.name = data.name;
    artist.spotify = data.spotify;

    await this.artistRepository.save(artist);

    return artist;
  }

  async findAlbum(query: FindAlbumDto): Promise<Album | undefined> {
    return this.albumRepository.findOne({
      where: { spotify: { id: query.spotify.id } },
    });
  }

  async createAlbum(data: CreateAlbumDto): Promise<Album> {
    const album = this.albumRepository.create();

    album.name = data.name;
    album.artists = data.artists;
    album.spotify = data.spotify;

    await this.albumRepository.save(album);

    return album;
  }

  async findTrack(query: FindTrackDto): Promise<Track | undefined> {
    return this.trackRepository.findOne({
      where: { spotify: { id: query.spotify.id } },
    });
  }

  async createTrack(data: CreateTrackDto): Promise<Track> {
    const track = this.trackRepository.create();

    track.name = data.name;
    track.artists = data.artists;
    track.album = data.album;
    track.spotify = data.spotify;

    await this.trackRepository.save(track);

    return track;
  }
}
