const express = require('express')
const router = express.Router()
const result = require('../views/result')

const modelService = require('../service/model')
// import checkerService from '../service/checker'

router.get('/api/models', (req, res) => {
  modelService.findModels()
  .then((models) => {
    console.debug('Find Models Success!')
    res.send(result.succeed(models))
  }).catch(err => {
    console.error('Find Models Failure!')
    res.send(result.fail(err.message))
  })
})

router.post('/api/model', (req, res) => {
  modelService.insertOrUpdateModel({name: req.body.name, interfaceStr: req.body.interface})
  .then(() => {
    console.debug('Inset Update Success!')
    res.send(result.succeed())
  }).catch(err => {
    console.error('Inset Update Failure!')
    res.send(result.fail(err.message))
  })
})

module.exports = router