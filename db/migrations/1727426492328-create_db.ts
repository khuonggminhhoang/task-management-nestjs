import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDb1727426492328 implements MigrationInterface {
    name = 'CreateDb1727426492328'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task" ("id" SERIAL NOT NULL, "title" character varying(100) NOT NULL, "status" character varying NOT NULL DEFAULT 'initial', "content" character varying(255) NOT NULL, "time_start" TIMESTAMP NOT NULL DEFAULT now(), "time_finish" TIMESTAMP NOT NULL, "deleted" boolean NOT NULL DEFAULT false, "created_by" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "parentTaskId" integer, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "full_name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "gender" boolean, "deleted" boolean NOT NULL DEFAULT false, "refresh_token" character varying NOT NULL DEFAULT '', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_tasks_task" ("userId" integer NOT NULL, "taskId" integer NOT NULL, CONSTRAINT "PK_5c112b153701f554843915f643f" PRIMARY KEY ("userId", "taskId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1fb6a986133f8f6cafb3d4fb31" ON "user_tasks_task" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9bcb8e9773d79c9874a61f79c3" ON "user_tasks_task" ("taskId") `);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_8bf6d736c49d48d91691ea0dfe5" FOREIGN KEY ("parentTaskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_tasks_task" ADD CONSTRAINT "FK_1fb6a986133f8f6cafb3d4fb31e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_tasks_task" ADD CONSTRAINT "FK_9bcb8e9773d79c9874a61f79c3d" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_tasks_task" DROP CONSTRAINT "FK_9bcb8e9773d79c9874a61f79c3d"`);
        await queryRunner.query(`ALTER TABLE "user_tasks_task" DROP CONSTRAINT "FK_1fb6a986133f8f6cafb3d4fb31e"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_8bf6d736c49d48d91691ea0dfe5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9bcb8e9773d79c9874a61f79c3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1fb6a986133f8f6cafb3d4fb31"`);
        await queryRunner.query(`DROP TABLE "user_tasks_task"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "task"`);
    }

}
