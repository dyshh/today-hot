const juejin = require('./juejin')
const hupu = require('./hupu')

module.exports = {
    tasks: () => [juejin.task(), hupu.task()]
}
