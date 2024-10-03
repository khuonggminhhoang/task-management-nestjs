import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldIsNotified1727938804134 implements MigrationInterface {
    name = 'AddFieldIsNotified1727938804134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" ADD "isNotified" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "isNotified"`);
    }

}
