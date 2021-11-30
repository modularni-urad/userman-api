import { TNAMES } from '../consts'

function tableName (tname) {
  return process.env.CUSTOM_MIGRATION_SCHEMA 
    ? `${process.env.CUSTOM_MIGRATION_SCHEMA}.${tname}`
    : tname
}

exports.up = (knex, Promise) => {
  return knex.schema.createTable(tableName(TNAMES.USERS), (table) => {
    table.increments('id').primary()
    table.string('username', 64).notNullable()
    table.string('name', 128).notNullable()
    table.string('email', 128)
    table.string('password', 2048).notNullable()
    table.integer('status').notNullable().defaultTo(1)
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
    table.unique(['username'])
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(tableName(TNAMES.USERS))
}
