import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCollectionTable1728361629154 implements MigrationInterface {
    name = 'CreateCollectionTable1728361629154'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "base_entity" ("id" SERIAL NOT NULL, "deleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_03e6c58047b7a4b3f6de0bfa8d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "collection" ("id" SERIAL NOT NULL, "deleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "url" character varying, "userId" integer, CONSTRAINT "PK_ad3f485bbc99d875491f44d7c85" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "collection" ADD CONSTRAINT "FK_ca25eb01f75a85272300f336029" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "collection" DROP CONSTRAINT "FK_ca25eb01f75a85272300f336029"`);
        await queryRunner.query(`DROP TABLE "collection"`);
        await queryRunner.query(`DROP TABLE "base_entity"`);
    }

}
