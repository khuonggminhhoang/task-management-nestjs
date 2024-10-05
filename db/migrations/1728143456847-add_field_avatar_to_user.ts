import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldAvatarToUser1728143456847 implements MigrationInterface {
    name = 'AddFieldAvatarToUser1728143456847'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "avatar" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar"`);
    }

}
