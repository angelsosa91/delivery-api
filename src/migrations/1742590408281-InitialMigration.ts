import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1742590408281 implements MigrationInterface {
    name = 'InitialMigration1742590408281'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`auth_id\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`auth_id\` varchar(255) NULL`);
    }

}
