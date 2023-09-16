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

export class CreateGenreTables0000000000005 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "genre",
        columns: [
          primaryUUIDColumn,
          {
            name: "name",
            type: "varchar",
          },
        ],
        indices: [
          new TableIndex({
            name: "IDX_GENRE_NAME",
            columnNames: ["name"],
          }),
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: "artist_genres",
        columns: [
          {
            name: "artistId",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "genreId",
            type: "uuid",
            isPrimary: true,
          },
        ],
        indices: [
          new TableIndex({
            name: "IDX_ARTIST_GENRES_ARTIST_ID",
            columnNames: ["artistId"],
          }),
          new TableIndex({
            name: "IDX_ARTIST_GENRES_GENRE_ID",
            columnNames: ["genreId"],
          }),
        ],
        foreignKeys: [
          new TableForeignKey({
            name: "FK_ARTIST_ID",
            columnNames: ["artistId"],
            referencedColumnNames: ["id"],
            referencedTableName: "artist",
          }),
          new TableForeignKey({
            name: "FK_GENRE_ID",
            columnNames: ["genreId"],
            referencedColumnNames: ["id"],
            referencedTableName: "genre",
          }),
        ],
      }),
      true,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("artist_genres");
    await queryRunner.dropTable("genre");
  }
}
