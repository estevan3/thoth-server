import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1726023230129 implements MigrationInterface {
    name = 'Init1726023230129'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "authorId" uuid, "postId" uuid, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nick" character varying NOT NULL, "name" character varying NOT NULL, "birthdate" date NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "isAdmin" boolean NOT NULL DEFAULT false, "create_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_7c154ca1d4ac730c755cfce9b7c" UNIQUE ("nick"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "posts_likes_users" ("postsId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_22375725d266ad40d394810d96b" PRIMARY KEY ("postsId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ddf35245765d65f6e1a9430fa7" ON "posts_likes_users" ("postsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_af99ecc047b6eefd6b93479fc7" ON "posts_likes_users" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_c5a322ad12a7bf95460c958e80e" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_cdc670193be6ca43f590dbabcee" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts_likes_users" ADD CONSTRAINT "FK_ddf35245765d65f6e1a9430fa70" FOREIGN KEY ("postsId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "posts_likes_users" ADD CONSTRAINT "FK_af99ecc047b6eefd6b93479fc7f" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts_likes_users" DROP CONSTRAINT "FK_af99ecc047b6eefd6b93479fc7f"`);
        await queryRunner.query(`ALTER TABLE "posts_likes_users" DROP CONSTRAINT "FK_ddf35245765d65f6e1a9430fa70"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_cdc670193be6ca43f590dbabcee"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_c5a322ad12a7bf95460c958e80e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_af99ecc047b6eefd6b93479fc7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ddf35245765d65f6e1a9430fa7"`);
        await queryRunner.query(`DROP TABLE "posts_likes_users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "posts"`);
    }

}
