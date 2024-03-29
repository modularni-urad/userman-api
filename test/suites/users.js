/* global describe it */

module.exports = (g) => {
  //
  const r = g.chai.request(g.baseurl)

  const p1 = {
    username: 'gandalf',
    name: 'gandalf the grey'
  }

  return describe('users', () => {
    it('must not create a new item wihout approp group', async () => {
      g.mockUser.groups = ['standardusers']
      const res = await r.post('/').send(p1).set('Authorization', 'Bearer f')
      res.status.should.equal(401)
    })

    it('shall create a new item', async () => {
      g.mockUser.groups = ['user_admins']
      const res = await r.post('/').send(p1).set('Authorization', 'Bearer f')
      res.status.should.equal(201)
    })

    it('mustnot get the pok1 without auth', async () => {
      const res = await r.get('/')
      res.status.should.equal(401)
    })

    it('shall get the pok1', async () => {
      const res = await r.get('/').set('Authorization', 'Bearer f')
      res.status.should.equal(200)
      res.body.should.have.lengthOf(1)
      res.body[0].username.should.equal(p1.username)
      p1.id = res.body[0].id
    })

    it('shall update the pok1', async () => {
      const change = { status: 2 }
      const res = await r.put(`/${p1.id}/`).send(change).set('Authorization', 'Bearer f')
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

    it('shall set password', async () => {
      const p = 'secretWhisper'
      const res = await r.put(`/chpasswd/${p1.id}`).send({password: p})
        .set('Authorization', 'Bearer f')
      res.status.should.equal(200)
      p1.password = p
    })

    it('shall login pok1', async () => {
      const res = await r.post('/login').send(p1)
      res.status.should.equal(200)
      res.body.username.should.equal(p1.username)
    })

    it('must not login pok1 with wrong credentials', async () => {
      const wrongKredec = Object.assign({}, p1, { password: 'ee' })
      const res = await r.post('/login').send(wrongKredec)
      res.status.should.equal(401)
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

    it('shall set my password', async () => {
      g.mockUser.groups = ['standardusers']
      g.mockUser.id = p1.id
      const p = 'newWhisper'
      const res = await r.put(`/chpasswd/${p1.id}`).send({password: p})
        .set('Authorization', 'Bearer f')
      res.status.should.equal(200)
      p1.password = p
    })

    it('mustnot set my password', async () => {
      g.mockUser.id = 42
      const p = 'newWhisper'
      const res = await r.put(`/chpasswd/${p1.id}`).send({password: p})
        .set('Authorization', 'Bearer f')
      res.status.should.equal(403)
    })
  })
}
