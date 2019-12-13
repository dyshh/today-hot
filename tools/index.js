const puppeteer = require('puppeteer')
const chalk = require('chalk')
const fs = require('fs')
/**
 * 通用爬取任务方法
 * @param {} param0
 * @param {} eventHandle
 */
const Task = ({ pageUrl, pageSelector, title }, eventHandle) => {
    return new Promise(async (resolve, reject) => {
        try {
            // 打开chrome浏览器
            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            })
            // 新建页面
            const page = await browser.newPage()
            // 跳转到pageUrl
            await page.goto(pageUrl)
            // 等待eventHandle处理完
            eventHandle && (await eventHandle(page))
            // 等列表页加载完
            await page.waitForSelector(pageSelector, {
                timeout: 5000
            })
            const res = await page.$$eval(pageSelector, ele =>
                ele.map(el => ({
                    url: el.href,
                    text: el.innerText
                }))
            )
            await browser.close()
            resolve({
                title,
                list: res
            })
        } catch (e) {
            reject(e)
        }
    }).catch(e => {
        console.log(e)
        console.log(chalk.white.bgRed.bold(`[Failed] 获取 ${title} 失败`))
    })
}

const FileServer = {
    // 写文件
    write(path, text) {
        fs.writeFileSync(path, text)
    },
    // 读文件
    read(path) {
        return fs.readFileSync(path)
    },
    // 创建markdown内容
    createMdMsg(res, today) {
        return res.reduce((preContent, { title, list }) => {
            const curTitle = `## ${title}\n`
            const curContent = list.reduce((c, { url, text }) => {
                return c + `[${text}](${url})  \n`
            }, '')
            return preContent + curTitle + curContent
        }, `# ${today}  \n`)
    }
}
module.exports = {
    Task,
    FileServer
}
