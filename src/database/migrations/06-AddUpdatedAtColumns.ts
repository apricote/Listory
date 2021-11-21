import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddUpdatedAtColumnes0000000000006 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "artist",
      new TableColumn({
        name: "updatedAt",
        type: "timestamp",
        default: "NOW()",
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("artist", "updatedAt");
  }
}
