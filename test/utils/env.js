import path from 'path'
process.env.PORT = 33333
process.env.DATABASE_URL = ':memory:'
process.env.NODE_ENV = 'test'
process.env.CONF_FOLDER = path.resolve(path.dirname(__filename), '../confs')
process.env.DOMAIN = 'testdomain.cz'
process.env.DOMAIN_TO_ORGID = '{"testdomain.cz":1}'