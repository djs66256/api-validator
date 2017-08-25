let fetch = require('whatwg-fetch')

fetch.fetch('http://localhost:3000/api/model', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'afeaf',
    interface: "ahaojei"
  })
})

console.log('ahhaha')