
function make({code, result, message}) {
  return {code, result, message}
}

module.exports = {
  succeed(result = '') {
    return make({code: 1, result})
  },
  fail(message, code = -1) {
    return make({code, message})
  }
}