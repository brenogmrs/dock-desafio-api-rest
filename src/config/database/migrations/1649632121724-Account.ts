import {MigrationInterface, QueryRunner} from "typeorm";

export class Account1649632121724 implements MigrationInterface {
    name = 'Account1649632121724'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "account_holder_id" uuid NOT NULL, "number" integer NOT NULL, "agency" character varying NOT NULL, "balance" numeric(10,2) NOT NULL DEFAULT '0', "status" character varying NOT NULL DEFAULT 'AVAILABLE', "active" boolean NOT NULL DEFAULT true, CONSTRAINT "REL_4ad01f8177844b73cca3dd0973" UNIQUE ("account_holder_id"), CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_4ad01f8177844b73cca3dd09734" FOREIGN KEY ("account_holder_id") REFERENCES "account_holder"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_4ad01f8177844b73cca3dd09734"`);
        await queryRunner.query(`DROP TABLE "account"`);
    }

}
