let puppeteer = require('puppeteer');

const fs = require('fs');
const path = require('path');
const host = 'http://yourwebsite.com/';
const brokenlinkFilePath = path.join(__dirname, 'brokenLink.txt');
const validUrlFilePath = path.join(__dirname, 'validUrlFile.txt');
const exceptionUrls = ['http://yourwebsite.com/download','http://yourwebsite.com/files/downloads.php'];

let browser; 
let page; 
function isValidUrl(url) {
    if (exceptionUrls.findIndex(exceptionUrl => url.startsWith(exceptionUrl)) >= 0) {
        return false;
    }
    return url.startsWith(host) && !url.includes('/#');
}

class LinksChecker {

    constructor() {
        this.brokenLinks = [];
        this.validLinks = [];
        this.visitedLinks = [];
    }

    async visit(url) {
        this.visitedLinks.push(url);
        return page.goto(url);
    }

    async run() {
        browser = await puppeteer.launch({ headless: true });
        page = await browser.newPage();

        page.on('response', (res) => {
            let url = res.url();
            let currentPageUrl = page.url();
            if (res.status() == 404) {
                this.saveBrokenLink(url, currentPageUrl);
            } else {
                this.saveValidLink(url);
            }
        })

        await this.visitPage(host);
        await browser.close();
    }

    async visitPage(url, referrerUrl) {
        //过滤链接
        if (this.visitedLinks.includes(url) || !isValidUrl(url)) return;
        let res = await this.visit(url);

        if (res && res.status() == 404) {
            this.saveBrokenLink(url, referrerUrl);
        } else {
            this.saveValidLink(url);
        }

        //获取所有的link
        const hrefs = await page.evaluate(
            () => Array.from(document.body.querySelectorAll('a[href]'), ({ href }) => href)
        );

        for (const href of hrefs) {
            await this.visitPage(href, url);
        }
    }

    saveBrokenLink(link, referrer) {
        if (!this.brokenLinks.includes(link)) {
            this.brokenLinks.push(link);
            fs.appendFileSync(brokenlinkFilePath, `${link} from (${referrer})\n`);
            return true;
        }
        return false;
    }

    saveValidLink(link) {
        if (!this.validLinks.includes(link)) {
            this.validLinks.push(link);
            fs.appendFileSync(validUrlFilePath, link + '\n');
            return true;
        }
        return false;
    }
}

let check = new LinksChecker();
check.run();