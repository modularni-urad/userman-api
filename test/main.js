/* global describe before after */
// const fs = require('fs')
import chai from 'chai'
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
chai.should()

const g = { chai }
require('./env/init')(g)

describe('app', () => {
  before(() => {
    const InitModule = require('../index')
    return g.InitApp(InitModule)
  })
  after(g.close)

  describe('userman API', () => {
    //
    const submodules = [
      './suites/users'
    ]
    submodules.map((i) => {
      const subMod = require(i)
      subMod(g)
    })
  })
})
