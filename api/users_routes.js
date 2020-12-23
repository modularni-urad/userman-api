import users from './users'
import { ROLE } from '../consts'

export default (ctx) => {
  const { knex, auth, JSONBodyParser } = ctx
  const app = ctx.express()

  app.get('/', (req, res, next) => {
    users.list(req.query, knex).then(info => {
      res.json(info)
      next()
    }).catch(next)
  })

  app.post('/',
    auth.requireMembership(ROLE.ADMIN),
    JSONBodyParser,
    (req, res, next) => {
      users.create(req.body, auth.getUID(req), knex)
        .then(created => { res.json(created[0]) })
        .catch(next)
    })

  app.put('/:id',
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

  return app
}
