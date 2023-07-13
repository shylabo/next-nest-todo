import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTodosTable1689013637200 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        create table todos (
            id bigserial primary key,
            name text,
            completed boolean not null default false
        );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`drop table todos;`);
  }
}
