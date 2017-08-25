const fs = require('fs')
const path = require('path')

class Persistent {
  constructor({root = path.join('..', 'data')}={}) {
    this.root = root
    this.node_modules = path.join(root, 'node_modules', 'api-validator')
    this.apiValidatorIndex = path.join(this.node_modules, 'index.js')
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
            str = JSON.stringify(data)
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

  interfacePath(name) {
    let model = this.models[name]
    if (model && model.filename) {
      return path.join(this.node_modules, model.filename)
    }
    else {
      return null
    }
  }

  insertOrUpdateInterface(str, name) {
    return new Promise((resolve, reject) => {
      let model = this.models[name]
      if (!model) {
        model = {
          interface: name,
          filename: `${name}.ts`
        }
      }
      this.saveModel(`interface ${name}\n ${str}`, model.filename)
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
  removeInterface(name) {
    return new Promise((resolve, reject) => {
      delete this.models[name]
      return this.saveApiValidatorIndex().then(() => {
        return this.saveModels()
      })
    })
  }

  removeApi(api) {

  }
  insertOrUpdateApi(api, interfaceName) {
    return new Promise((resolve, reject) => {
      let apiInfo = this.models[api]
      if (apiInfo) {
        apiInfo.interface = interfaceName
      }
      else {
        apiInfo = {interface: interfaceName}
        this.models[api] = apiInfo
        this.saveApiValidatorIndex().catch(reject)
      }
      this.saveModels().then(() => {
        this.saveApis().then(resolve).catch(reject)
      }).catch(reject)
    })
  }

  saveApiValidatorIndex() {
    let importStr = ''
    let exportStr = ''
    for (var k in this.models) {
      importStr += `import ${k} from '${this.models[k].interface}'\n`
      if (exportStr.length) {
        exportStr += ',\n  '
      }
      exportStr += `${k}`
    }
    let str = `${importStr}\nexport default {\n${exportStr}\n}`

    return this._writeToPath(str, this.apiValidatorIndex)
  }
  saveApis() {
    return this._writeToPath(this.apis, this.apisPath)
  }
  saveModels() {
    return this._writeToPath(this.models, this.modelsPath)
  }
  saveModel(str, filename) {
    return this._writeToPath(str, path.join(this.node_modules, filename))
  }
}

const p = new Persistent()

module.exports = p