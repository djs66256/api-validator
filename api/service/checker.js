const ts = require('typescript')
const fs = require('fs')

class Checker {
  validate(path) {
    return new Promise((resolve, reject) => {
      if (!path) {
        reject(new Error('File name is null'))
        return
      }
      if (!fs.existsSync(path)) {
        reject(new Error('File not exists!'))
        return
      }
      let program = ts.createProgram([path], {})
      let diagnostics = program.getGlobalDiagnostics()
      if (!diagnostics || diagnostics.length == 0) {
        resolve(true)
      }
      else {
        reject(new Error(JSON.stringify(diagnostics)))
      }
    })
  }

  validateInterface(itf) {

  }

  validateData(json) {
    return new Promise((resolve, reject) => {
      try {
        let _ = JSON.parse(json)
      }
      catch (e) {
        reject(e)
      }
    })
  }
}

const checker = new Checker()

module.exports = checker