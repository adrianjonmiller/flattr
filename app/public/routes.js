const path = require('path')
const router = require('express').Router()

const paths = {}
paths.views = path.join(__dirname, 'views')

router.use(function timeLog (req, res, next) {
  next()
})

router.get('/', (req, res) => {
  res.render(paths.views)
})

module.exports = router
