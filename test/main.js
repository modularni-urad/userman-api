/* global describe before after */
// const fs = require('fs')
import chai from 'chai'
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const g = require('./env/init')

describe('app', () => {
  before(() => {
    const InitModule = require('../index')
    return g.InitApp(InitModule.default)
  })
  after(g.close)

  describe('API', () => {
    //
    const submodules = [
      './users_t'
    ]
    submodules.map((i) => {
      const subMod = require(i)
      subMod(g)
    })
  })
})
