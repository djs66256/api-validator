const persist = require('./ts-persistent')
const checker = require('./checker')

class ModelService {
  insertOrUpdateModel({name, interfaceStr}) {
    return new Promise((resolve, reject) => {
      if (name && interfaceStr) {
        persist.insertOrUpdateInterface(interfaceStr, name)
        .then(() => {
          let filePath = persist.interfacePath(name)
          return checker.validate(filePath).catch((err) => {
            persist.removeInterface(name)
            throw err
          })
        })
        .then(resolve)
        .catch(reject)
      }
      else {
        reject(new Error('Invalidate parameters!'))
      }
    })
  }

  findModels() {
    return new Promise((resolve, reject) => {
      resolve(Object.keys(persist.models).map(key => {
        let model = persist.models[key]
        return Object.assign(model, {name: key})
      }))
    })
  }

  findModelByName(name) {
    return new Promise((resolve, reject) => {
      let model = persist.models[name]
      if (model) {
        persist.findModelData(model.filename).then(data => {
          model.data = data
          resolve(model)
        }).catch(reject)
      }
      else {
        reject(new Error('Model not found!'))
      }
    })
  }

  deleteModel(name) {
    return new Promise((resolve, reject) => {
      if (!name) {
        reject(new Error('File not exists!'))
        return
      }
      persist.removeInterface(name).then(resolve).catch(reject)
    })
  }
}

const service = new ModelService()

module.exports = service