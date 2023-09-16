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

export class CreateApiTokensTable0000000000007 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "api_token",
        columns: [
          primaryUUIDColumn,
          {
            name: "userId",
            type: "uuid",
          },
          {
            name: "description",
            type: "varchar",
          },
          {
            name: "token",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "lastUsedAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "revokedAt",
            type: "timestamp",
            default: null,
            isNullable: true,
          },
        ],
        indices: [
          new TableIndex({
            name: "IDX_API_TOKEN_USER_ID",
            columnNames: ["userId"],
          }),
        ],
        foreignKeys: [
          new TableForeignKey({
            name: "FK_API_TOKEN_USER_ID",
            columnNames: ["userId"],
            referencedColumnNames: ["id"],
            referencedTableName: "user",
          }),
        ],
      }),
      true,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("api_token");
  }
}
