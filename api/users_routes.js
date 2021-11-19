import _ from 'underscore'
import users from './users'
import formConfig from './formconfig'
import { ROLE } from '../consts'

export default (ctx) => {
  const { knex, auth, express } = ctx
  const { session, required, requireMembership, isMember, getUID } = auth
  const reqireAdmin = requireMembership(ROLE.ADMIN)
  const api = express()
  const bodyParser = express.json()

  api.get('/formconfig.json', (req, res, next) => res.json(formConfig))

  api.get('/', session, reqireAdmin, (req, res, next) => {
      const filter = JSON.parse(_.get(req, 'query.filter', '{}'))
      const implicitFilter = { orgid: req.orgconfig.orgid }
      Object.assign(filter, implicitFilter)
      users.list(Object.assign(req.query, { filter }), knex).then(info => {
        res.json(info)
        next()
      }).catch(next)
    })

  api.post('/login', bodyParser, (req, res, next) => {
    users.login(req.body, req.orgconfig.orgid, knex)
      .then(found => { res.status(200).json(found) })
      .catch(next)
  })
  api.get('/info/:uid', (req, res, next) => {
    users.info(req.params.uid, req.orgconfig.orgid, knex).then(found => { 
      res.status(200).json(found) 
    }).catch(next)
  })
  api.get('/search', (req, res, next) => {
    users.search(req.query.query, req.orgconfig.orgid, knex).then(found => { 
      res.status(200).json(found) 
    }).catch(next)
  })

  api.post('/', session, reqireAdmin, bodyParser, (req, res, next) => {
      users.create(req.body, req.orgconfig.orgid, knex)
        .then(created => { res.status(201).json(created[0]) })
        .catch(next)
    })

  api.put('/:id', session, required,
    (req, res, next) => {
      isMember(req, ROLE.ADMIN) || // i am admin
      getUID(req).toString() === req.params.id // or i update myself
        ? next() : next(401)
    },
    bodyParser,
    (req, res, next) => {
      users.update(req.params.id, req.body, knex)
        .then(updated => { res.json(updated[0]) })
        .catch(next)
    })

  return api
}
