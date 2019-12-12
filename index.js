const path = require('path')
const dayjs = require('dayjs')
const chalk = require('chalk')
const express = require('express')
const schedule = require('node-schedule')
const app = express()
const { tasks } = require('./tasks')
const { FileServer } = require('./tools')
const htmlPath = path.join(__dirname, './html')

// 提供静态页面
app.use(
    express.static(htmlPath, {
        setHeaders(res) {
            res.set('Access-Control-Allow-Origin', '*')
        }
    })
)

app.listen(8888)

function mainTask() {
    // 今天
    const now = dayjs().format('YYYY-MM-DD')
    // 并发
    const getMsgTask = Promise.all(tasks())
    getMsgTask
        .then(res => {
            // 现有log
            const { data } = JSON.parse(FileServer.read(path.join(htmlPath, './index.json')).toString())
            const text = FileServer.createMdMsg(res, now)
            console.log(chalk.red(`[Success] 成功获取 [${now}] 资讯`))
            FileServer.write(
                path.join(htmlPath, './index.json'),
                JSON.stringify({
                    data: [
                        {
                            date: now,
                            text
                        },
                        ...data.filter(item => item.date !== now) // 覆盖现有的今天数据
                    ]
                })
            )
        })
        .catch(e => {
            console.log(chalk.white.bgRed.bold(`[Failed] 获取 ${now} 资讯 失败`))
            mainTask()
        })
}

mainTask()

function crontab() {
    // 每五分钟跑一次
    schedule.scheduleJob(`0 */5 *  * *`, mainTask)
}

crontab()
