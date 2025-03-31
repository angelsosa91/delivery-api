import { MigrationInterface, QueryRunner } from "typeorm";

export class ManualMigration1743446815711 implements MigrationInterface {
    name = 'ManualMigration1743446815711'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tariff_distance\` ADD \`delivery_type\` enum ('MOTOCICLETA', 'VEHICULOS_LIGEROS') NOT NULL DEFAULT 'MOTOCICLETA'`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`delivery_type\` enum ('MOTOCICLETA', 'VEHICULOS_LIGEROS') NOT NULL DEFAULT 'MOTOCICLETA'`);
        await queryRunner.query(`ALTER TABLE \`orders_budget\` ADD \`delivery_type\` enum ('MOTOCICLETA', 'VEHICULOS_LIGEROS') NOT NULL DEFAULT 'MOTOCICLETA'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders_budget\` DROP COLUMN \`delivery_type\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`delivery_type\``);
        await queryRunner.query(`ALTER TABLE \`tariff_distance\` DROP COLUMN \`delivery_type\``);
    }

}
