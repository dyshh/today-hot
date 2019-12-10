const { Task } = require('../tools')
const options = {
    pageUrl: 'https://bbs.hupu.com/lol',
    pageSelector: '.titlelink.box a.truetit',
    title: '今日虎扑lol'
}

module.exports = {
    task: async () => {
        return await Task(options)
    }
}
