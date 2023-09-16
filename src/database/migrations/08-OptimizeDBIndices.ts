import { MigrationInterface, QueryRunner, TableIndex } from "typeorm";

export class OptimizeDBIndices0000000000008 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndices("artist", [
      new TableIndex({
        // This index helps with the "update artist" job
        name: "IDX_ARTIST_UPDATED_AT",
        columnNames: ["updatedAt"],
      }),
    ]);

    await queryRunner.createIndices("listen", [
      new TableIndex({
        // This index helps with the "getCrawlableUserInfo" query
        name: "IDX_LISTEN_USER_ID_PLAYED_AT",
        columnNames: ["userId", "playedAt"],
      }),
    ]);

    // handled by Primary Key on (albumId, artistId)
    await queryRunner.dropIndex("album_artists", "IDX_ALBUM_ARTISTS_ALBUM_ID");

    // handled by Primary Key on (artistId, genreId)
    await queryRunner.dropIndex("artist_genres", "IDX_ARTIST_GENRES_ARTIST_ID");

    // handled by IDX_LISTEN_UNIQUE on (trackId, userId, playedAt)
    await queryRunner.dropIndex("listen", "IDX_LISTEN_TRACK_ID");
    // handled by IDX_LISTEN_USER_ID_PLAYED_AT on (userId, playedAt)
    await queryRunner.dropIndex("listen", "IDX_LISTEN_USER_ID");

    // handled by Primary Key on (trackId, artistId)
    await queryRunner.dropIndex("track_artists", "IDX_TRACK_ARTISTS_TRACK_ID");
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndices("album_artists", [
      new TableIndex({
        name: "IDX_ALBUM_ARTISTS_ALBUM_ID",
        columnNames: ["albumId"],
      }),
    ]);

    await queryRunner.createIndices("artist_genres", [
      new TableIndex({
        name: "IDX_ARTIST_GENRES_ARTIST_ID",
        columnNames: ["artistId"],
      }),
    ]);

    await queryRunner.createIndices("listen", [
      new TableIndex({
        name: "IDX_LISTEN_TRACK_ID",
        columnNames: ["trackId"],
      }),
      new TableIndex({
        name: "IDX_LISTEN_USER_ID",
        columnNames: ["userId"],
      }),
    ]);

    await queryRunner.createIndices("track_artists", [
      new TableIndex({
        name: "IDX_TRACK_ARTISTS_TRACK_ID",
        columnNames: ["trackId"],
      }),
    ]);

    await queryRunner.dropIndex("artist", "IDX_ARTIST_UPDATED_AT");
    await queryRunner.dropIndex("listen", "IDX_LISTEN_USER_ID_PLAYED_AT");
  }
}
