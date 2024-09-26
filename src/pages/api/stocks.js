import edgeChromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

async function scrapeLogic(res) {
    const executablePath = await edgeChromium.executablePath;

    // Launch the browser
    const browser = await puppeteer.launch({
        executablePath,
        args: [...edgeChromium.args, '--no-sandbox'],
        headless: true,
        ignoreHTTPSErrors: true
    });
    try {
        // Create a page
        const page = await browser.newPage();

        // Go to your site
        await page.goto('https://ph.investing.com/equities/trending-stocks', { waitUntil: 'load', timeout: 0 });

        const trendingStocks = await page.evaluate(() =>
            Array.from(document.querySelectorAll('div.chartPopWrap  .marketChart'), (e) => {
                return {
                    id: e.parentElement.getAttribute('id'),
                    company: e.querySelector('a:first-child').textContent,
                    link: 'https://ph.investing.com' + e.querySelector('a').getAttribute('href'),
                    price: e.querySelector('a:first-child + div :first-child').textContent,
                    priceIncrease: e.querySelector('a:first-child + div :nth-child(2)').textContent,
                    pricePercentage: e.querySelector('a:first-child + div :nth-child(3)').textContent
                };
            })
        );

        const marketMovers = await page.evaluate(() =>
            Array.from(document.querySelectorAll('table#MM_table1 tbody tr'), (e) => {
                return {
                    company: e.querySelector('td:nth-child(2) a').textContent,
                    link: 'https://ph.investing.com' + e.querySelector('a').getAttribute('href'),
                    price: e.querySelector('td:nth-child(3)').textContent,
                    pricePercentage: e.querySelector('td:nth-child(4)').textContent,
                    volume: e.querySelector('td:nth-child(5)').textContent
                };
            })
        );
        // Close browser.
        res.status(300).json({
            trendingStocks,
            marketMovers
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err });
    } finally {
        // await browser.close();
    }
}

export default function handler(req, res) {
    scrapeLogic(res);
}
