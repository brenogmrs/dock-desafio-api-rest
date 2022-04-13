import {MigrationInterface, QueryRunner} from "typeorm";

export class FixAccountFieldsTypes1649785869269 implements MigrationInterface {
    name = 'FixAccountFieldsTypes1649785869269'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "number"`);
        await queryRunner.query(`ALTER TABLE "account" ADD "number" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "number"`);
        await queryRunner.query(`ALTER TABLE "account" ADD "number" integer NOT NULL`);
    }

}
