import edgeChromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

async function scrapeLogic(res) {
    // Launch the browser
    const executablePath = await edgeChromium.executablePath;

    try {
        const browser = await puppeteer.launch({
            executablePath,
            args: [...edgeChromium.args, '--no-sandbox'],
            headless: true,
            ignoreHTTPSErrors: true
        });
        // Create a page
        const page = await browser.newPage();

        await page.goto('https://ph.investing.com/news/most-popular-news', {
            timeout: 0,
            waitUntil: 'load'
        });

        const newsList = await page.evaluate(() =>
            Array.from(document.querySelectorAll('div.largeTitle .articleItem'), (e) => {
                return {
                    title: e.querySelector('.textDiv a.title').innerHTML,
                    link: 'https://ph.investing.com' + e.querySelector('.textDiv a.title').getAttribute('href'),
                    image: e.querySelector('a.img img').getAttribute('src'),
                    details: e.querySelector('span.articleDetails .date')?.innerHTML,
                    summary: e.querySelector('.textDiv p')?.innerHTML
                };
            })
        );

        // Close browser.
        res.status(300).json({
            newsList: newsList.slice(0, 8)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

export default function handler(req, res) {
    scrapeLogic(res);
}
