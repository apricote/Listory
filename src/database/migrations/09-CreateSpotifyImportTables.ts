import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from "typeorm";
import { TableColumnOptions } from "typeorm/schema-builder/options/TableColumnOptions";

const primaryUUIDColumn: TableColumnOptions = {
  name: "id",
  type: "uuid",
  isPrimary: true,
  isGenerated: true,
  generationStrategy: "uuid",
};

export class CreateSpotifyImportTables0000000000009
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "spotify_extended_streaming_history_listen",
        columns: [
          primaryUUIDColumn,
          { name: "userId", type: "uuid" },
          { name: "playedAt", type: "timestamp" },
          { name: "spotifyTrackUri", type: "varchar" },
          { name: "trackId", type: "uuid", isNullable: true },
          { name: "listenId", type: "uuid", isNullable: true },
        ],
        indices: [
          new TableIndex({
            name: "IDX_SPOTIFY_EXTENDED_STREAMING_HISTORY_LISTEN_USER_PLAYED_AT",
            columnNames: ["userId", "playedAt", "spotifyTrackUri"],
            isUnique: true,
          }),
        ],
        foreignKeys: [
          new TableForeignKey({
            name: "FK_SPOTIFY_EXTENDED_STREAMING_HISTORY_LISTEN_USER_ID",
            columnNames: ["userId"],
            referencedColumnNames: ["id"],
            referencedTableName: "user",
          }),
          new TableForeignKey({
            name: "FK_SPOTIFY_EXTENDED_STREAMING_HISTORY_LISTEN_TRACK_ID",
            columnNames: ["trackId"],
            referencedColumnNames: ["id"],
            referencedTableName: "track",
          }),
          new TableForeignKey({
            name: "FK_SPOTIFY_EXTENDED_STREAMING_HISTORY_LISTEN_LISTEN_ID",
            columnNames: ["listenId"],
            referencedColumnNames: ["id"],
            referencedTableName: "listen",
          }),
        ],
      }),
      true,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("spotify_extended_streaming_history_listen");
  }
}
