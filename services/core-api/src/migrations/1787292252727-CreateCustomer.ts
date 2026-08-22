import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCustomer1787292252727 implements MigrationInterface {
    name = 'CreateCustomer1787292252727'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customers" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" character varying NOT NULL, "webhook_url" character varying NOT NULL, "secret" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "customers"`);
    }

}
