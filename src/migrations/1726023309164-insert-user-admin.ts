import { MigrationInterface, QueryRunner } from "typeorm";
import { adminVars } from "../config/env.js";

export class InsertUserAdmin1726023309164 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`INSERT INTO "users" ("nick", "name", "birthdate", "email", "password", "isAdmin") VALUES ('${adminVars.ADMIN_NICK}', '${adminVars.ADMIN_NAME}', '${adminVars.ADMIN_BIRTH}', '${adminVars.ADMIN_EMAIL}', '${adminVars.ADMIN_PASS}', TRUE)`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`DELETE FROM "users" WHERE nick='${adminVars.ADMIN_NICK}'`)
    }

}
