import { MigrationInterface, QueryRunner } from 'typeorm';

export class AccountHolder1649617981069 implements MigrationInterface {
    name = 'AccountHolder1649617981069';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "account_holder" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "full_name" character varying NOT NULL, "cpf" character varying NOT NULL, CONSTRAINT "UQ_8c971b18585986cb43b3ff8ee40" UNIQUE ("cpf"), CONSTRAINT "PK_4ace43524e5340e9f32adb0318c" PRIMARY KEY ("id"))`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "account_holder"`);
    }
}
