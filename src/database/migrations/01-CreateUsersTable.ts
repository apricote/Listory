import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateUsersTable0000000000001 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "user",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid",
          },
          {
            name: "displayName",
            type: "varchar",
          },
          {
            name: "photo",
            type: "varchar",
            isNullable: true,
          },
          { name: "spotifyId", type: "varchar", isNullable: true },
          { name: "spotifyAccesstoken", type: "varchar", isNullable: true },
          { name: "spotifyRefreshtoken", type: "varchar", isNullable: true },
          {
            name: "spotifyLastrefreshtime",
            type: "timestamp",
            isNullable: true,
          },
        ],
        indices: [
          new TableIndex({
            name: "IDX_USER_SPOTIFY_ID",
            columnNames: ["spotifyId"],
            isUnique: true,
          }),
        ],
      }),
      true,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("user");
  }
}
