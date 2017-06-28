const bodyParser = require('body-parser')
const path = require('path')
const router = require('express').Router()

const Data = require(path.join(__dirname, './controller'))

const urlencodedParser = bodyParser.urlencoded({ extended: false })

// Paths
const paths = {}
paths.dataUsers = path.join(__dirname, '../data/users.json')
paths.dataDb = path.join(__dirname, '../data/db.json')

router.use(function timeLog (req, res, next) {
  next()
})

router.get('/:ref', (req, res) => {
  res.render(paths.views)
})

module.exports = router
