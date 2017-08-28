const fs = require('fs')
const path = require('path')

class Persistent {
  constructor({root = path.join('..', 'data')}={}) {
    this.root = root
    this.node_modules = path.join(root, 'node_modules', 'api-validator')
    this.apiValidatorIndex = path.join(this.node_modules, 'index.ts')
    this.modelsPath = path.join(root, 'models.json')
    this.apisPath = path.join(root, 'apis.json')

    this.models = {}
    this.apis = {}

    this._initDirectories()
  }

  _initDirectories() {
    if (!fs.existsSync(this.root)) {
      this._mkdir(this.root)
    }
    if (!fs.existsSync(this.node_modules)) {
      this._mkdir(this.node_modules)
    }
    if (!fs.existsSync(this.apiValidatorIndex)) {
      this.saveApiValidatorIndex('export default {}')
    }
    if (fs.existsSync(this.modelsPath)) {
      try {
        let modelsData = fs.readFileSync(this.modelsPath, {encoding: 'utf8'})
        let models = JSON.parse(modelsData.toString())
        if (models) {
          this.models = models
        }  
      }
      catch(e) {
        console.error('Models Data is broken! ', e.message)
      }
    }
    if (fs.existsSync(this.apisPath)) {
      try {
        let apisData = fs.readFileSync(this.apisPath, {encoding: 'utf8'})
        let apis = JSON.parse(apisData.toString())
        if (apis) {
          this.apis = apis
        }  
      }
      catch(e) {
        console.error('Models Data is broken! ', e.message)
      }
    }
  }
  _mkdir(dir) {
    if (!dir) {
      console.error('path can not be null!')
      return
    }
    let superdir = path.dirname(dir)
    if (fs.existsSync(superdir)) {
      fs.mkdirSync(dir)
    }
    else {
      this._mkdir(superdir)
    }
  }
  _writeToPath(data, path) {
    return new Promise((resolve, reject) => {
      try {
        if (!data) {
          reject(new Error('data is null!'))
          return
        }
        let str = data
        if (typeof data !== 'string') {
            str = JSON.stringify(data, null, 2)
        }
        fs.writeFile(path, str, (err) => {
          if (err) {
            reject(err)
          }
          else {
            resolve(path)
          }
        })
      }
      catch (e) {
        reject(e)
      }
    })
  }
  _readFromPath(path) {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(path)) {
        let buffer = fs.readFileSync(path)
        resolve(buffer.toString())
      }
      else {
        reject(new Error('File not exists!'))
      }
    })
  }

  // Model
  interfacePath(name) {
    let filename = this._modelFilename(name)
    return filename && filename + '.ts'
  }
  modelDataPath(name) {
    let filename = this._modelFilename(name)
    return filename && filename + '.txt'
  }
  _modelFilename(name) {
    let model = this.models[name]
    if (model && model.filename) {
      return path.join(this.node_modules, model.filename)
    }
    else {
      return null
    }
  }

  // {name: {interface: name, filename: name}}
  insertOrUpdateInterface(str, name) {
    return new Promise((resolve, reject) => {
      let model = this.models[name]
      if (!model) {
        model = {
          interface: name,
          filename: `${name}`
        }
      }
      this.saveInterface(`export default interface ${name}\n${str}`, model.filename)
      .then(() => {
        return this.saveModelData(str, model.filename)
      })
      .then(()=> {
        this.models[name] = model
        return this.saveApiValidatorIndex()
      })
      .then(() => {
        return this.saveModels()
      })
      .then(resolve)
      .catch(reject)
    })
  }
  removeInterface({name}) {
    return new Promise((resolve, reject) => {
      if (!this.models[name]) {
        reject(new Error('Model not exists!'))
        return
      }
      this.findApiByModel(name).then(apis => {
        if (apis && apis.length > 0) {
          reject(new Error(`Can not remove ${name}, ${JSON.stringify(apis)} contains model!`))
        }
        else {
          delete this.models[name]
          return this.saveApiValidatorIndex().then(() => {
            return this.saveModels().then(resolve).catch(reject)
          }).catch(reject)
        }
      }).catch(reject)
    })
  }

  saveApiValidatorIndex() {
    let importStr = ''
    let exportStr = ''
    for (var k in this.models) {
      importStr += `import ${k} from './${this.models[k].interface}'\n`
      if (exportStr.length) {
        exportStr += ',\n  '
      }
      exportStr += `${k}`
    }
    let str = `${importStr}\nexport default {\n  ${exportStr}\n}`

    return this._writeToPath(str, this.apiValidatorIndex)
  }
  saveModels() {
    return this._writeToPath(this.models, this.modelsPath)
  }
  saveModelData(str, filename) {
    return this._writeToPath(str, path.join(this.node_modules, filename + '.txt'))
  }
  findModelData(filename) {
    return this._readFromPath(path.join(this.node_modules, filename + '.txt'))
  }
  saveInterface(str, filename) {
    return this._writeToPath(str, path.join(this.node_modules, filename + '.ts'))
  }

  // Api
  // {api: {name:model}}
  findApis() {
    return new Promise((resolve, reject) => {
      resolve(this.apis)
    })
  }
  findApi(api) {
    return new Promise((resolve, reject) => {
      let apiInfo = this.apis[api]
      if (apiInfo) {
        resolve(apiInfo)
      }
      else {
        reject(new Error('Api not exists!'))
      }
    })
  }
  findApiByModel(name) {
    return new Promis((resolve, reject) => {
      let apis = Object.keys(this.apis).filter(key => {
        return this.apis[key].name === name
      })
      resolve(apis)
    })
  }
  removeApi(api) {
    return new Promise((resolve, reject) => {
      delete this.apis[api]
      this.saveApis().then(resolve).catch(reject)
    })
  }
  insertOrUpdateApi({api, model}) {
    return new Promise((resolve, reject) => {
      if (!this.models[model]) {
        reject(new Error(`Model [${model}] not exists!`))
        return
      }
      let apiInfo = this.apis[api]
      if (apiInfo) {
        apiInfo.name = model
      }
      else {
        this.apis[api] = {name: model}
      }
      this.saveApis().then(resolve).catch(reject)
    })
  }
  saveApis() {
    return this._writeToPath(this.apis, this.apisPath)
  }
}

const p = new Persistent()

module.exports = p