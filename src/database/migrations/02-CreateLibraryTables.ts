import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from "typeorm";
import { TableColumnOptions } from "typeorm/schema-builder/options/TableColumnOptions";

const spotifyLibraryDetailsColumns: TableColumnOptions[] = [
  { name: "spotifyId", type: "varchar", isNullable: true },
  { name: "spotifyUri", type: "varchar", isNullable: true },
  { name: "spotifyType", type: "varchar", isNullable: true },
  { name: "spotifyHref", type: "varchar", isNullable: true },
];

const primaryUUIDColumn: TableColumnOptions = {
  name: "id",
  type: "uuid",
  isPrimary: true,
  isGenerated: true,
  generationStrategy: "uuid",
};

export class CreateLibraryTables0000000000002 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "artist",
        columns: [
          primaryUUIDColumn,
          {
            name: "name",
            type: "varchar",
          },
          ...spotifyLibraryDetailsColumns,
        ],
        indices: [
          new TableIndex({
            name: "IDX_ARTIST_SPOTIFY_ID",
            columnNames: ["spotifyId"],
            isUnique: true,
          }),
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: "album",
        columns: [
          primaryUUIDColumn,
          {
            name: "name",
            type: "varchar",
          },
          ...spotifyLibraryDetailsColumns,
        ],
        indices: [
          new TableIndex({
            name: "IDX_ALBUM_SPOTIFY_ID",
            columnNames: ["spotifyId"],
            isUnique: true,
          }),
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: "track",
        columns: [
          primaryUUIDColumn,
          {
            name: "name",
            type: "varchar",
          },
          { name: "albumId", type: "uuid" },
          ...spotifyLibraryDetailsColumns,
        ],
        indices: [
          new TableIndex({
            name: "IDX_TRACK_SPOTIFY_ID",
            columnNames: ["spotifyId"],
            isUnique: true,
          }),
        ],
        foreignKeys: [
          new TableForeignKey({
            name: "FK_TRACK_ALBUM_ID",
            columnNames: ["albumId"],
            referencedColumnNames: ["id"],
            referencedTableName: "album",
          }),
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: "album_artists",
        columns: [
          {
            name: "albumId",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "artistId",
            type: "uuid",
            isPrimary: true,
          },
        ],
        indices: [
          new TableIndex({
            name: "IDX_ALBUM_ARTISTS_ALBUM_ID",
            columnNames: ["albumId"],
          }),
          new TableIndex({
            name: "IDX_ALBUM_ARTISTS_ARTIST_ID",
            columnNames: ["artistId"],
          }),
        ],
        foreignKeys: [
          new TableForeignKey({
            name: "FK_ALBUM_ID",
            columnNames: ["albumId"],
            referencedColumnNames: ["id"],
            referencedTableName: "album",
          }),
          new TableForeignKey({
            name: "FK_ARTIST_ID",
            columnNames: ["artistId"],
            referencedColumnNames: ["id"],
            referencedTableName: "artist",
          }),
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: "track_artists",
        columns: [
          {
            name: "trackId",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "artistId",
            type: "uuid",
            isPrimary: true,
          },
        ],
        indices: [
          new TableIndex({
            name: "IDX_TRACK_ARTISTS_TRACK_ID",
            columnNames: ["trackId"],
          }),
          new TableIndex({
            name: "IDX_TRACK_ARTISTS_ARTIST_ID",
            columnNames: ["artistId"],
          }),
        ],
        foreignKeys: [
          new TableForeignKey({
            name: "FK_TRACK_ARTISTS_TRACK_ID",
            columnNames: ["trackId"],
            referencedColumnNames: ["id"],
            referencedTableName: "track",
          }),
          new TableForeignKey({
            name: "FK_TRACK_ARTISTS_ARTIST_ID",
            columnNames: ["artistId"],
            referencedColumnNames: ["id"],
            referencedTableName: "artist",
          }),
        ],
      }),
      true,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("track_artists");
    await queryRunner.dropTable("album_artists");
    await queryRunner.dropTable("track");
    await queryRunner.dropTable("album");
    await queryRunner.dropTable("artist");
  }
}
