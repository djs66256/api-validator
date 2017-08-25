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
      resolve(persist.models)
    })
  }
}

const service = new ModelService()

module.exports = service