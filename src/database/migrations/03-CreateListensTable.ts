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

export class CreateListensTable0000000000003 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "listen",
        columns: [
          primaryUUIDColumn,
          {
            name: "playedAt",
            type: "timestamp",
          },
          {
            name: "trackId",
            type: "uuid",
          },
          {
            name: "userId",
            type: "uuid",
          },
        ],
        indices: [
          new TableIndex({
            name: "IDX_LISTEN_TRACK_ID",
            columnNames: ["trackId"],
          }),
          new TableIndex({
            name: "IDX_LISTEN_USER_ID",
            columnNames: ["userId"],
          }),
          new TableIndex({
            name: "IDX_LISTEN_UNIQUE",
            isUnique: true,
            columnNames: ["trackId", "userId", "playedAt"],
          }),
        ],
        foreignKeys: [
          new TableForeignKey({
            name: "FK_LISTEN_TRACK_ID",
            columnNames: ["trackId"],
            referencedColumnNames: ["id"],
            referencedTableName: "track",
          }),
          new TableForeignKey({
            name: "FK_LISTEN_USER_ID",
            columnNames: ["userId"],
            referencedColumnNames: ["id"],
            referencedTableName: "user",
          }),
        ],
      }),
      true
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("listen");
  }
}
