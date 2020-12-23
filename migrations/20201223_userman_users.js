import { TNAMES } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TNAMES.USERS, (table) => {
    table.increments('id').primary()
    table.string('username', 64).notNullable()
    table.string('name', 128).notNullable()
    table.string('email', 128)
    table.string('password', 2048)
    table.integer('status').notNullable().defaultTo(1)
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TNAMES.USERS)
}
