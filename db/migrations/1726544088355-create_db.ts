import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDb1726544088355 implements MigrationInterface {
    name = 'CreateDb1726544088355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`task\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(100) NOT NULL, \`status\` varchar(255) NOT NULL DEFAULT 'initial', \`content\` varchar(255) NOT NULL, \`time_start\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`time_finish\` datetime NOT NULL, \`deleted\` tinyint NOT NULL DEFAULT 0, \`created_by\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`parentTaskId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`full_name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`gender\` tinyint NULL, \`deleted\` tinyint NOT NULL DEFAULT 0, \`refresh_token\` varchar(255) NOT NULL DEFAULT '', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_tasks_task\` (\`userId\` int NOT NULL, \`taskId\` int NOT NULL, INDEX \`IDX_1fb6a986133f8f6cafb3d4fb31\` (\`userId\`), INDEX \`IDX_9bcb8e9773d79c9874a61f79c3\` (\`taskId\`), PRIMARY KEY (\`userId\`, \`taskId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD CONSTRAINT \`FK_8bf6d736c49d48d91691ea0dfe5\` FOREIGN KEY (\`parentTaskId\`) REFERENCES \`task\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_tasks_task\` ADD CONSTRAINT \`FK_1fb6a986133f8f6cafb3d4fb31e\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_tasks_task\` ADD CONSTRAINT \`FK_9bcb8e9773d79c9874a61f79c3d\` FOREIGN KEY (\`taskId\`) REFERENCES \`task\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_tasks_task\` DROP FOREIGN KEY \`FK_9bcb8e9773d79c9874a61f79c3d\``);
        await queryRunner.query(`ALTER TABLE \`user_tasks_task\` DROP FOREIGN KEY \`FK_1fb6a986133f8f6cafb3d4fb31e\``);
        await queryRunner.query(`ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_8bf6d736c49d48d91691ea0dfe5\``);
        await queryRunner.query(`DROP INDEX \`IDX_9bcb8e9773d79c9874a61f79c3\` ON \`user_tasks_task\``);
        await queryRunner.query(`DROP INDEX \`IDX_1fb6a986133f8f6cafb3d4fb31\` ON \`user_tasks_task\``);
        await queryRunner.query(`DROP TABLE \`user_tasks_task\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`task\``);
    }

}
