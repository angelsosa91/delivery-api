import { MigrationInterface, QueryRunner } from "typeorm";

export class EntitiesMigration21742993760634 implements MigrationInterface {
    name = 'EntitiesMigration21742993760634'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`origin\` ADD \`sync_id\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`customer\` ADD \`sync_id\` int NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customer\` DROP COLUMN \`sync_id\``);
        await queryRunner.query(`ALTER TABLE \`origin\` DROP COLUMN \`sync_id\``);
    }

}
