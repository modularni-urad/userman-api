/* global describe before after */
// const fs = require('fs')
import chai from 'chai'

import { init } from '../server'
import dbinit from './utils/dbinit'
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const port = process.env.PORT || 3333
const g = {
  baseurl: `http://localhost:${port}`,
  UID: 110,
  usergroups: []
}
const mocks = {
  dbinit: dbinit,
  auth: {
    required: (req, res, next) => { return next() },
    requireMembership: (gid) => (req, res, next) => {
      return g.usergroups.indexOf(gid) >= 0 ? next() : next(403)
    },
    getUID: (req) => g.UID
  },
  ttn: { data: () => new Promise(resolve => resolve(g.ttnClient)) }
}

describe('app', () => {
  before(done => {
    init(mocks).then(app => {
      g.server = app.listen(port, '127.0.0.1', (err) => {
        if (err) return done(err)
        setTimeout(done, 1500)
      })
    }).catch(done)
  })
  after(done => {
    g.server.close(err => {
      return err ? done(err) : done()
    })
  })

  describe('API', () => {
    //
    const submodules = [
      './users'
    ]
    submodules.map((i) => {
      const subMod = require(i)
      subMod(g)
    })
  })
})
