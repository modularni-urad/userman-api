/* global describe it */
const chai = require('chai')
chai.should()
// import _ from 'underscore'

module.exports = (g) => {
  //
  const r = chai.request(g.baseurl)

  const p1 = {
    username: 'gandalf',
    name: 'gandalf the grey',
    password: 'secretWhisper'
  }

  return describe('users', () => {
    // it('must not create a new item wihout approp group', async () => {
    //   const res = await r.post('/').send(p1)
    //   res.status.should.equal(403)
    // })

    it('shall create a new item', async () => {
      g.usergroups = ['user_admin']
      const res = await r.post('/').send(p1)
      res.status.should.equal(201)
    })

    // it('shall update the item pok1', () => {
    //   const change = {
    //     name: 'pok1changed'
    //   }
    //   return r.put(`/tasks/${p.id}`).send(change)
    //   .set('Authorization', g.gimliToken)
    //   .then(res => {
    //     res.should.have.status(200)
    //   })
    // })

    it('shall get the pok1', async () => {
      const res = await r.get('/')
      res.status.should.equal(200)
      res.body.should.have.lengthOf(1)
      res.body[0].username.should.equal(p1.username)
    })

    it('shall get the pok1 with pagination', async () => {
      const res = await r.get('/?currentPage=1&perPage=10&sort=id:asc')
      res.status.should.equal(200)
      res.body.data.should.have.lengthOf(1)
      res.body.data[0].username.should.equal(p1.username)
      res.body.pagination.currentPage = 1
    })

    it('shall login pok1', async () => {
      const res = await r.post('/login').send(p1)
      res.status.should.equal(200)
      res.body.username.should.equal(p1.username)
    })

    it('must not login pok1 with wrong credentials', async () => {
      const wrongKredec = Object.assign({}, p1, { password: 'ee' })
      const res = await r.post('/login').send(wrongKredec)
      res.status.should.equal(400)
      res.text.should.equal('invalid credentials')
    })
  })
}
