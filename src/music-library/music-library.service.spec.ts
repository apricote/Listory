import { Test, TestingModule } from "@nestjs/testing";
import { PostgresErrorCodes } from "../database/error-codes";
import { Album } from "./album.entity";
import { AlbumRepository } from "./album.repository";
import { Artist } from "./artist.entity";
import { ArtistRepository } from "./artist.repository";
import { CreateAlbumDto } from "./dto/create-album.dto";
import { CreateArtistDto } from "./dto/create-artist.dto";
import { CreateGenreDto } from "./dto/create-genre.dto";
import { CreateTrackDto } from "./dto/create-track.dto";
import { UpdateArtistDto } from "./dto/update-artist.dto";
import { Genre } from "./genre.entity";
import { GenreRepository } from "./genre.repository";
import { MusicLibraryService } from "./music-library.service";
import { Track } from "./track.entity";
import { TrackRepository } from "./track.repository";

describe("MusicLibraryService", () => {
  let service: MusicLibraryService;
  let albumRepository: AlbumRepository;
  let artistRepository: ArtistRepository;
  let genreRepository: GenreRepository;
  let trackRepository: TrackRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MusicLibraryService,
        { provide: AlbumRepository, useFactory: () => ({}) },
        { provide: ArtistRepository, useFactory: () => ({}) },
        { provide: GenreRepository, useFactory: () => ({}) },
        { provide: TrackRepository, useFactory: () => ({}) },
      ],
    }).compile();

    service = module.get<MusicLibraryService>(MusicLibraryService);
    albumRepository = module.get<AlbumRepository>(AlbumRepository);
    artistRepository = module.get<ArtistRepository>(ArtistRepository);
    genreRepository = module.get<GenreRepository>(GenreRepository);
    trackRepository = module.get<TrackRepository>(TrackRepository);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
    expect(albumRepository).toBeDefined();
    expect(artistRepository).toBeDefined();
    expect(genreRepository).toBeDefined();
    expect(trackRepository).toBeDefined();
  });

  describe("Artist", () => {
    describe("findArtist", () => {
      it("returns the entity", async () => {
        const artist = {
          id: "ARTIST",
        };
        artistRepository.findOne = jest.fn().mockResolvedValue(artist);

        await expect(
          service.findArtist({ spotify: { id: "spotify_artist" } })
        ).resolves.toEqual(artist);

        expect(artistRepository.findOne).toHaveBeenCalledTimes(1);
        expect(artistRepository.findOne).toHaveBeenCalledWith({
          where: { spotify: { id: "spotify_artist" } },
        });
      });
    });

    describe("createArtist", () => {
      let createArtistDto: CreateArtistDto;
      let artist: Artist;

      beforeEach(() => {
        createArtistDto = {
          name: "Foo",
          spotify: {
            id: "SPOTIFY_ID",
          },
        } as CreateArtistDto;

        artist = {
          ...createArtistDto,
          id: "ARTIST",
        } as Artist;

        artistRepository.create = jest.fn().mockReturnValue({ id: "ARTIST" });
        artistRepository.save = jest.fn().mockResolvedValue(undefined);
      });

      it("creates the entity", async () => {
        await expect(service.createArtist(createArtistDto)).resolves.toEqual(
          artist
        );

        expect(artistRepository.create).toHaveBeenCalledTimes(1);
        expect(artistRepository.save).toHaveBeenCalledTimes(1);
        expect(artistRepository.save).toHaveBeenCalledWith(artist);
      });

      it("returns the entity on a unique violation", async () => {
        artist.id = "ARTIST2";
        service.findArtist = jest
          .fn()
          .mockResolvedValue({ ...artist, id: "ARTIST2" });

        const uniqueViolationError = new Error();
        // @ts-expect-error
        uniqueViolationError.code = PostgresErrorCodes.UNIQUE_VIOLATION;
        // @ts-expect-error
        uniqueViolationError.constraint = "IDX_ARTIST_SPOTIFY_ID";

        artistRepository.save = jest
          .fn()
          .mockRejectedValue(uniqueViolationError);

        await expect(service.createArtist(createArtistDto)).resolves.toEqual(
          artist
        );

        expect(service.findArtist).toHaveBeenCalledTimes(1);
        expect(service.findArtist).toHaveBeenCalledWith({
          spotify: { id: "SPOTIFY_ID" },
        });
      });

      it("throws on generic errors", async () => {
        artistRepository.save = jest
          .fn()
          .mockRejectedValue(new Error("Generic Error"));

        await expect(service.createArtist(createArtistDto)).rejects.toThrow(
          "Generic Error"
        );
      });
    });

    describe("updateArtist", () => {
      let updateArtistDto: UpdateArtistDto;
      let artist: Artist;

      beforeEach(() => {
        artist = {
          id: "ARTIST",
          name: "Foo",
          genres: [{ id: "GENRE_POP", name: "Baz Pop" }],
          spotify: {
            id: "SPOTIFY_ID",
          },
        } as Artist;

        updateArtistDto = {
          artist,
          updatedFields: {
            name: "Bar",
            genres: [
              { id: "GENRE_METAL", name: "Foo Metal" },
              { id: "GENRE_ROCK", name: "Bar Rock" },
            ],
          },
        } as UpdateArtistDto;

        artistRepository.save = jest
          .fn()
          .mockImplementation(async (_artist) => _artist);
      });

      it("updates the entity", async () => {
        await expect(service.updateArtist(updateArtistDto)).resolves.toEqual(
          artist
        );

        expect(artistRepository.save).toHaveBeenCalledTimes(1);
        expect(artistRepository.save).toHaveBeenCalledWith(artist);

        expect(artist).toHaveProperty("name", "Bar");
        expect(artist).toHaveProperty("genres", expect.arrayContaining([]));
      });

      it("throws on generic errors", async () => {
        artistRepository.save = jest
          .fn()
          .mockRejectedValue(new Error("Generic Error"));

        await expect(service.updateArtist(updateArtistDto)).rejects.toThrow(
          "Generic Error"
        );
      });
    });
  });

  describe("Album", () => {
    describe("findAlbum", () => {
      it("returns the entity", async () => {
        const album = {
          id: "ALBUM",
        };
        albumRepository.findOne = jest.fn().mockResolvedValue(album);

        await expect(
          service.findAlbum({ spotify: { id: "spotify_album" } })
        ).resolves.toEqual(album);

        expect(albumRepository.findOne).toHaveBeenCalledTimes(1);
        expect(albumRepository.findOne).toHaveBeenCalledWith({
          where: { spotify: { id: "spotify_album" } },
        });
      });
    });

    describe("createAlbum", () => {
      let createAlbumDto: CreateAlbumDto;
      let album: Album;

      beforeEach(() => {
        createAlbumDto = {
          name: "Foo",
          spotify: {
            id: "SPOTIFY_ID",
          },
        } as CreateAlbumDto;

        album = {
          ...createAlbumDto,
          id: "ALBUM",
        } as Album;

        albumRepository.create = jest.fn().mockReturnValue({ id: "ALBUM" });
        albumRepository.save = jest.fn().mockResolvedValue(undefined);
      });

      it("creates the entity", async () => {
        await expect(service.createAlbum(createAlbumDto)).resolves.toEqual(
          album
        );

        expect(albumRepository.create).toHaveBeenCalledTimes(1);
        expect(albumRepository.save).toHaveBeenCalledTimes(1);
        expect(albumRepository.save).toHaveBeenCalledWith(album);
      });

      it("returns the entity on a unique violation", async () => {
        album.id = "ALBUM2";
        service.findAlbum = jest
          .fn()
          .mockResolvedValue({ ...album, id: "ALBUM2" });

        const uniqueViolationError = new Error();
        // @ts-expect-error
        uniqueViolationError.code = PostgresErrorCodes.UNIQUE_VIOLATION;
        // @ts-expect-error
        uniqueViolationError.constraint = "IDX_ALBUM_SPOTIFY_ID";

        albumRepository.save = jest
          .fn()
          .mockRejectedValue(uniqueViolationError);

        await expect(service.createAlbum(createAlbumDto)).resolves.toEqual(
          album
        );

        expect(service.findAlbum).toHaveBeenCalledTimes(1);
        expect(service.findAlbum).toHaveBeenCalledWith({
          spotify: { id: "SPOTIFY_ID" },
        });
      });

      it("throws on generic errors", async () => {
        albumRepository.save = jest
          .fn()
          .mockRejectedValue(new Error("Generic Error"));

        await expect(service.createAlbum(createAlbumDto)).rejects.toThrow(
          "Generic Error"
        );
      });
    });
  });

  describe("Genre", () => {
    describe("findGenre", () => {
      it("returns the entity", async () => {
        const genre = {
          id: "GENRE",
          name: "Foo",
        };
        genreRepository.findOne = jest.fn().mockResolvedValue(genre);

        await expect(service.findGenre({ name: "Foo" })).resolves.toEqual(
          genre
        );

        expect(genreRepository.findOne).toHaveBeenCalledTimes(1);
        expect(genreRepository.findOne).toHaveBeenCalledWith({
          where: { name: "Foo" },
        });
      });
    });

    describe("createGenre", () => {
      let createGenreDto: CreateGenreDto;
      let genre: Genre;

      beforeEach(() => {
        createGenreDto = {
          name: "Foo",
        } as CreateGenreDto;

        genre = {
          ...createGenreDto,
          id: "GENRE",
        } as Genre;

        genreRepository.create = jest.fn().mockReturnValue({ id: "GENRE" });
        genreRepository.save = jest.fn().mockResolvedValue(undefined);
      });

      it("creates the entity", async () => {
        await expect(service.createGenre(createGenreDto)).resolves.toEqual(
          genre
        );

        expect(genreRepository.create).toHaveBeenCalledTimes(1);
        expect(genreRepository.save).toHaveBeenCalledTimes(1);
        expect(genreRepository.save).toHaveBeenCalledWith(genre);
      });

      it("returns the entity on a unique violation", async () => {
        genre.id = "GENRE2";
        service.findGenre = jest
          .fn()
          .mockResolvedValue({ ...genre, id: "GENRE2" });

        const uniqueViolationError = new Error();
        // @ts-expect-error
        uniqueViolationError.code = PostgresErrorCodes.UNIQUE_VIOLATION;
        // @ts-expect-error
        uniqueViolationError.constraint = "IDX_GENRE_NAME";

        genreRepository.save = jest
          .fn()
          .mockRejectedValue(uniqueViolationError);

        await expect(service.createGenre(createGenreDto)).resolves.toEqual(
          genre
        );

        expect(service.findGenre).toHaveBeenCalledTimes(1);
        expect(service.findGenre).toHaveBeenCalledWith({
          name: "Foo",
        });
      });

      it("throws on generic errors", async () => {
        genreRepository.save = jest
          .fn()
          .mockRejectedValue(new Error("Generic Error"));

        await expect(service.createGenre(createGenreDto)).rejects.toThrow(
          "Generic Error"
        );
      });
    });
  });

  describe("Track", () => {
    describe("findTrack", () => {
      it("returns the entity", async () => {
        const track = {
          id: "TRACK",
        };
        trackRepository.findOne = jest.fn().mockResolvedValue(track);

        await expect(
          service.findTrack({ spotify: { id: "spotify_track" } })
        ).resolves.toEqual(track);

        expect(trackRepository.findOne).toHaveBeenCalledTimes(1);
        expect(trackRepository.findOne).toHaveBeenCalledWith({
          where: { spotify: { id: "spotify_track" } },
        });
      });
    });

    describe("createTrack", () => {
      let createTrackDto: CreateTrackDto;
      let track: Track;

      beforeEach(() => {
        createTrackDto = {
          name: "Foo",
          spotify: {
            id: "SPOTIFY_ID",
          },
        } as CreateTrackDto;

        track = {
          ...createTrackDto,
          id: "TRACK",
        } as Track;

        trackRepository.create = jest.fn().mockReturnValue({ id: "TRACK" });
        trackRepository.save = jest.fn().mockResolvedValue(undefined);
      });

      it("creates the entity", async () => {
        await expect(service.createTrack(createTrackDto)).resolves.toEqual(
          track
        );

        expect(trackRepository.create).toHaveBeenCalledTimes(1);
        expect(trackRepository.save).toHaveBeenCalledTimes(1);
        expect(trackRepository.save).toHaveBeenCalledWith(track);
      });

      it("returns the entity on a unique violation", async () => {
        track.id = "TRACK2";
        service.findTrack = jest
          .fn()
          .mockResolvedValue({ ...track, id: "TRACK2" });

        const uniqueViolationError = new Error();
        // @ts-expect-error
        uniqueViolationError.code = PostgresErrorCodes.UNIQUE_VIOLATION;
        // @ts-expect-error
        uniqueViolationError.constraint = "IDX_TRACK_SPOTIFY_ID";

        trackRepository.save = jest
          .fn()
          .mockRejectedValue(uniqueViolationError);

        await expect(service.createTrack(createTrackDto)).resolves.toEqual(
          track
        );

        expect(service.findTrack).toHaveBeenCalledTimes(1);
        expect(service.findTrack).toHaveBeenCalledWith({
          spotify: { id: "SPOTIFY_ID" },
        });
      });

      it("throws on generic errors", async () => {
        trackRepository.save = jest
          .fn()
          .mockRejectedValue(new Error("Generic Error"));

        await expect(service.createTrack(createTrackDto)).rejects.toThrow(
          "Generic Error"
        );
      });
    });
  });
});
