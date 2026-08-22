import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDeliveryAttempt1787425226070 implements MigrationInterface {
    name = 'CreateDeliveryAttempt1787425226070'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."delivery_attempts_status_enum" AS ENUM('pending', 'delivered', 'retrying', 'dead')`);
        await queryRunner.query(`CREATE TABLE "delivery_attempts" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "event_id" uuid NOT NULL, "customer_id" uuid NOT NULL, "attempt_number" integer NOT NULL, "status" "public"."delivery_attempts_status_enum" NOT NULL DEFAULT 'pending', "response_code" integer, "error" text, "attempted_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_41eba4eb5401d72860f7cd9a7ac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_98a4e1e3025f768de1493ecedec"`);
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_98a4e1e3025f768de1493ecedec" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "delivery_attempts" ADD CONSTRAINT "FK_75c69a3ec47f4e7039a4e6b614d" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "delivery_attempts" ADD CONSTRAINT "FK_0b24dc8be833ddeda54002e0c89" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "delivery_attempts" DROP CONSTRAINT "FK_0b24dc8be833ddeda54002e0c89"`);
        await queryRunner.query(`ALTER TABLE "delivery_attempts" DROP CONSTRAINT "FK_75c69a3ec47f4e7039a4e6b614d"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_98a4e1e3025f768de1493ecedec"`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_98a4e1e3025f768de1493ecedec" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "delivery_attempts"`);
        await queryRunner.query(`DROP TYPE "public"."delivery_attempts_status_enum"`);
    }

}
