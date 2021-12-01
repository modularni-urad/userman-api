
export const TNAMES = {
  USERS: 'users'
}

export const ROLE = {
  ADMIN: 'user_admins' || process.env.USER_ADMIN_GROUP_SLUG
}

export function createPwdHash (pwd) {
  return process.env.HASH_FUNC
    ? eval(process.env.HASH_FUNC.replace('<PWD>', pwd))
    : require('crypto').createHash('sha256').update(pwd).digest('base64')
}

export function getQB (knex, tablename, schema) {
  return schema
    ? knex(knex.ref(tablename).withSchema(schema))
    : knex(tablename)
}