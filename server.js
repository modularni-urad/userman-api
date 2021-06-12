import express from 'express'
import path from 'path'
import { attachPaginate } from 'knex-paginate'
import initErrorHandlers from 'modularni-urad-utils/error_handlers'
import { 
  required, requireMembership, isMember, getUID 
} from 'modularni-urad-utils/auth'
import initDB from 'modularni-urad-utils/db'
import initRoutes from './api/users_routes'

export async function init (mocks = null) {
  const migrationsDir = path.join(__dirname, 'migrations')
  const knex = mocks
    ? await mocks.dbinit(migrationsDir)
    : await initDB(migrationsDir)
  attachPaginate()
  const app = express()
  const auth = mocks ? mocks.auth : { required, requireMembership, isMember, getUID }
  const appContext = { express, knex, auth }

  app.use(initRoutes(appContext))

  initErrorHandlers(app) // ERROR HANDLING
  return app
}

if (process.env.NODE_ENV !== 'test') {
  const host = process.env.HOST || '127.0.0.1'
  const port = process.env.PORT || 3000
  init().then(app => {
    app.listen(port, host, (err) => {
      if (err) throw err
      console.log(`radagast rides his crew on ${host}:${port}`)
    })
  }).catch(err => {
    console.error(err)
  })
}
