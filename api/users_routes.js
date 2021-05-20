import _ from 'underscore'
import users from './users'
import { ROLE } from '../consts'

const D2O = JSON.parse(process.env.DOMAIN_TO_ORGID)

export default (ctx) => {
  const { knex, auth, JSONBodyParser } = ctx
  const app = ctx.express()

  app.get('/', 
    _loadOrgID,
    auth.requireMembership(ROLE.ADMIN),
    (req, res, next) => {
      const filter = JSON.parse(_.get(req, 'query.filter', '{}'))
      const implicitFilter = { orgid: req.orgid }
      Object.assign(filter, implicitFilter)
      users.list(Object.assign(req.query, { filter }), knex).then(info => {
        res.json(info)
        next()
      }).catch(next)
    })

  app.post('/',
    _loadOrgID,
    auth.requireMembership(ROLE.ADMIN),
    JSONBodyParser,
    (req, res, next) => {
      users.create(req.body, req.orgid, knex)
        .then(created => { res.status(201).json(created[0]) })
        .catch(next)
    })

  app.put('/:id',
    _loadOrgID,
    (req, res, next) => {
      auth.isMember(req, ROLE.ADMIN) || // i am admin
      auth.getUID(req).toString() === req.params.id // or i update myself
        ? next() : next(401)
    },
    JSONBodyParser,
    (req, res, next) => {
      users.update(req.params.id, req.body, knex)
        .then(updated => { res.json(updated[0]) })
        .catch(next)
    })

  function _loadOrgID (req, res, next) {
    const domain = process.env.DOMAIN || req.hostname
    req.orgid = D2O[domain]
    return req.orgid ? next() : next(404)
  }

  return app
}
