import { randomBytes } from 'crypto'
import { TNAMES, ROLE, createPwdHash, getQB } from '../consts'

const conf = {
  tablename: TNAMES.USERS,
  editables: ['username', 'name', 'email', 'status', 'password']
}

export default (ctx) => {
  const { knex, ErrorClass, auth } = ctx
  const _ = ctx.require('underscore')
  const entityMWBase = ctx.require('entity-api-base').default
  const MW = entityMWBase(conf, knex, ErrorClass)
  const publicParams = [ 'id', 'username', 'name', 'email' ]

  return {
    login: async function  (data, schema) {
      const errMesage = 'invalid credentials'
      const u = await getQB(knex, TNAMES.USERS, schema).where({username: data.username})
      if (u.length === 0) throw new ErrorClass(401, errMesage)
      const pwd = createPwdHash(data.password)
      if (u[0].password !== pwd) throw new ErrorClass(401, errMesage)
      return _.omit(u[0], 'password', 'status')
    },
    info: async function (uid, schema) {
      const cond = { id: uid }
      return getQB(knex, TNAMES.USERS, schema).where(cond).select(publicParams).first()
    },
    search: async function (query, schema) {
      return getQB(knex, TNAMES.USERS, schema)
        .where(function() {
          this.where('username', 'like', `%${query}%`)
              .orWhere('name', 'like', `%${query}%`)
        })
        .select(publicParams)
    },
    list: function (query, schema) {
      query.filter && Object.assign(query, { filter: JSON.parse(query.filter) })
      return MW.list(query, schema)
    },
    create: function (data, schema) {
      if (!data.username) {
        throw new ErrorClass(400, 'invalid data')
      }
      data.password = data.password || randomBytes(16).toString('hex')
      Object.assign(data, { password: createPwdHash(data.password) })
      return MW.create(data, schema)
    },
    update: async function (id, data, schema) {
      if (data.password) {
        data.password = createPwdHash(data.password)
      }
      return MW.update(id, data, schema)
    },
    canIUpdate: function (req, res, next) {
      const u = req.user !== null && !_.isUndefined(req.user)
      u && (
        auth.isMember(req, ROLE.ADMIN) // i am admin
        || auth.getUID(req).toString() === req.params.id // or i update myself
      ) ? next() : next(new ErrorClass(403, 'you cannot update'))
    },
    updatePwd: async function (id, data, schema) {
      data.password = createPwdHash(data.password)
      return MW.update(id, { password: data.password }, schema)
    }
  }
}