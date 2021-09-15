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
      g.mockUser.groups = ['user_admin']
      const res = await r.post('/').send(p1).set('Authorization', 'Bearer f')
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
      const res = await r.get('/').set('Authorization', 'Bearer f')
      res.status.should.equal(200)
      res.body.should.have.lengthOf(1)
      res.body[0].username.should.equal(p1.username)
      p1.id = res.body[0].id
    })

    it('shall update the pok1', async () => {
      const change = { status: 2 }
      const res = await r.put('/1/').send(change).set('Authorization', 'Bearer f')
      res.status.should.equal(200)
    })

    it('shall get the pok1 with pagination', async () => {
      const res = await r.get('/?currentPage=1&perPage=10&sort=id:asc')
            .set('Authorization', 'Bearer f')
      res.status.should.equal(200)
      res.body.data.should.have.lengthOf(1)
      res.body.data[0].username.should.equal(p1.username)
      res.body.data[0].status.should.equal(2)
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

    it('shall return user info', async () => {
      const res = await r.get('/info/' + p1.id)
      res.status.should.equal(200)
      res.body.username.should.equal(p1.username)
    })

    it('shall search users', async () => {
      const res = await r.get('/search/?query=and')
      res.status.should.equal(200)
      res.body.should.have.lengthOf(1)
    })
  })
}
