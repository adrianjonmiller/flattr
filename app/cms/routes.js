const bodyParser = require('body-parser')
const path = require('path')
const router = require('express').Router()
const Models = require('../models')

const Data = require('../data')

const urlencodedParser = bodyParser.urlencoded({ extended: false })

// Paths
const paths = {}
paths.dataUsers = path.join(__dirname, '../data/users.json')
paths.dataDb = path.join(__dirname, '../data/db.json')

paths.views = path.join(__dirname, 'view.hbs')
paths.viewsEdit = path.join(paths.views, 'edit.hbs')
paths.viewsNew = path.join(paths.views, 'new.hbs')

router.use(function timeLog (req, res, next) {
  next()
})

router.get('/', (req, res) => {
  Data.read((snapShot) => {
    if (req.user.access > 1) {
      delete snapShot().user
    }
    res.render(paths.views, {data: snapShot()})
  })
})

router.get('/new/:model', (req, res) => {
  Data.read((snapShot) => {
    if (req.user.access > 1) {
      delete snapShot().user
    }
    res.render(paths.views, {data: snapShot(), model: Models[req.params.model](), id: req.params.model})
  })
})

router.post('/new/:model', urlencodedParser, (req, res) => {
  Data.create(req.params.model, req.body, function () {
    Data.read((snapShot) => {
      if (req.user.access > 1) {
        delete snapShot().user
      }
      res.render(paths.views, {data: snapShot(), model: Models[req.params.model](), id: req.params.model})
    })
  })
})

router.get('/edit/:model/:id', (req, res) => {
  Data.read((snapShot) => {
    if (req.user.access > 1) {
      delete snapShot().user
    }
    res.render(paths.views, {data: snapShot(), editing: snapShot()[req.params.model][req.params.id], model: Models[req.params.model](), id: req.params.id})
  })
})

router.post('/edit/:model/:id', urlencodedParser, (req, res) => {
  Data.update(`${req.params.model}.${req.params.id}`, req.body, function () {
    Data.read((snapShot) => {
      if (req.user.access > 1) {
        delete snapShot().user
      }
      res.render(paths.views, {data: snapShot(), editing: snapShot()[req.params.model][req.params.id], model: Models[req.params.model]()})
    })
  })
})

module.exports = router
