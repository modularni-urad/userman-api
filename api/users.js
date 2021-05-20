
import { whereFilter } from 'knex-filter-loopback'
import _ from 'underscore'
import { TNAMES, createPwdHash } from '../consts'

export default { create, update, list }

function list (query, knex) {
  const perPage = Number(query.perPage) || 10
  const currentPage = Number(query.currentPage) || null
  const fields = query.fields ? query.fields.split(',') : null
  const sort = query.sort ? query.sort.split(':') : null
  let qb = knex(TNAMES.USERS).where(whereFilter(query.filter))
  qb = fields ? qb.select(fields) : qb
  qb = sort ? qb.orderBy(sort[0], sort[1]) : qb
  return currentPage ? qb.paginate({ perPage, currentPage }) : qb
}

const editables = [
  'username', 'name', 'email', 'status', 'password'
]

function create (data, orgid, knex) {
  if (!data.password || !data.username) {
    throw new Error('invalid data')
  }
  data = _.pick(data, editables)
  Object.assign(data, { password: createPwdHash(data.password), orgid })
  return knex(TNAMES.USERS).insert(data).returning('*')
}

function update (id, data, knex) {
  data = _.pick(data, editables)
  if (data.password) {
    data.password = createPwdHash(data.password)
  }
  return knex(TNAMES.USERS).where({ id }).update(data).returning('*')
}