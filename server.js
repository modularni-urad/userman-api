import init from './index'

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
