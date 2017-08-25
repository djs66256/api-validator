const express = require('express')
const router = express.Router()
const result = require('../views/result')

const modelService = require('../service/model')
// import checkerService from '../service/checker'

router.get('/models', (req, res) => {
  modelService.findModels()
  .then((models) => {
    console.info('Find Models Success!')
    res.send(result.succeed(models))
  }).catch(err => {
    console.error('Find Models Failure!')
    res.send(result.fail(err.message))
  })
})

router.get('/model/:name', (req, res) => {
  let name = req.params.name
  if (name) {
    modelService.findModelByName(name)
    .then(model => {
      res.send(result.succeed(model))
    })
    .catch(e => {
      res.send(result.fail(e.message))
    })
  }
  else {
    res.send(result.fail('Invalidate parameters!'))
  }
})

router.post('/model', (req, res) => {
  modelService.insertOrUpdateModel({name: req.body.name, interfaceStr: req.body.interface})
  .then(() => {
    console.info('Inset Update Success!')
    res.send(result.succeed())
  }).catch(err => {
    console.error('Inset Update Failure!')
    res.send(result.fail(err.message))
  })
})

router.delete('/model/:name', (req, res) => {
  modelService.deleteModel({name: req.params.name})
  .then(() => {
    res.send(result.succeed())
  })
  .catch(e => {
    res.send(result.fail(e.message))
  })
})

module.exports = router