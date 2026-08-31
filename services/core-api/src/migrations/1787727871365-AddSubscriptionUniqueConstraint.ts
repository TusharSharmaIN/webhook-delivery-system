import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSubscriptionUniqueConstraint1787727871365 implements MigrationInterface {
    name = 'AddSubscriptionUniqueConstraint1787727871365'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_98a4e1e3025f768de1493ecedec"`);
        await queryRunner.query(`ALTER TABLE "delivery_attempts" DROP CONSTRAINT "FK_0b24dc8be833ddeda54002e0c89"`);
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "delivery_attempts" DROP CONSTRAINT "FK_75c69a3ec47f4e7039a4e6b614d"`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "delivery_attempts" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "delivery_attempts" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "UQ_406b3716d8d9faf1d74ef532c5a" UNIQUE ("customer_id", "event_type")`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_98a4e1e3025f768de1493ecedec" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "delivery_attempts" ADD CONSTRAINT "FK_75c69a3ec47f4e7039a4e6b614d" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "delivery_attempts" ADD CONSTRAINT "FK_0b24dc8be833ddeda54002e0c89" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "delivery_attempts" DROP CONSTRAINT "FK_0b24dc8be833ddeda54002e0c89"`);
        await queryRunner.query(`ALTER TABLE "delivery_attempts" DROP CONSTRAINT "FK_75c69a3ec47f4e7039a4e6b614d"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_98a4e1e3025f768de1493ecedec"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "UQ_406b3716d8d9faf1d74ef532c5a"`);
        await queryRunner.query(`ALTER TABLE "delivery_attempts" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "delivery_attempts" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "delivery_attempts" ADD CONSTRAINT "FK_75c69a3ec47f4e7039a4e6b614d" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "delivery_attempts" ADD CONSTRAINT "FK_0b24dc8be833ddeda54002e0c89" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_98a4e1e3025f768de1493ecedec" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
