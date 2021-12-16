import MWarez from './middleware'
import formConfig from './formconfig'
import { ROLE } from '../consts'

export default (ctx) => {
  const { auth, express, bodyParser } = ctx
  const { session, requireMembership } = auth
  const reqireAdmin = requireMembership(ROLE.ADMIN)
  const api = express()
  const MW = MWarez(ctx)

  api.get('/formconfig.json', (req, res, next) => res.json(formConfig))

  api.get('/', session, reqireAdmin, (req, res, next) => {
    MW.list(req.query, req.tenantid).then(info => {
      res.json(info)
    }).catch(next)
  })

  api.post('/login', bodyParser, (req, res, next) => {
    MW.login(req.body, req.tenantid)
      .then(found => { res.status(200).json(found) })
      .catch(next)
  })
  api.get('/info/:uid', (req, res, next) => {
    MW.info(req.params.uid, req.tenantid).then(found => { 
      res.status(200).json(found) 
    }).catch(next)
  })
  api.get('/search', (req, res, next) => {
    MW.search(req.query.query, req.tenantid).then(found => { 
      res.status(200).json(found) 
    }).catch(next)
  })

  api.post('/', session, reqireAdmin, bodyParser, (req, res, next) => {
    MW.create(req.body, req.tenantid)
      .then(created => { res.status(201).json(created[0]) })
      .catch(next)
  })

  api.put('/:id', session, MW.canIUpdate, bodyParser, (req, res, next) => {
    MW.update(req.params.id, req.body, req.tenantid)
      .then(updated => { res.json(updated[0]) })
      .catch(next)
  })

  api.put('/chpasswd/:id', session, MW.canIUpdate, bodyParser, (req, res, next) => {
    MW.updatePwd(req.params.id, req.body, req.tenantid)
      .then(updated => { res.json(updated[0]) })
      .catch(next)
  })

  return api
}
