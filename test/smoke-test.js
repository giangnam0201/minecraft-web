const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.resolve(__dirname, '..', 'public');
const PORT = 8765;
const RESULTS = [];

function log(msg) {
    const line = `[${new Date().toISOString()}] ${msg}`;
    console.log(line);
    RESULTS.push(line);
}

const MIME = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.wasm': 'application/wasm',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.json': 'application/json',
    '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
    let filePath = path.join(PUBLIC_DIR, req.url === '/' ? '/index.html' : req.url.split('?')[0]);
    const ext = path.extname(filePath).toLowerCase();
    const ct = MIME[ext] || 'application/octet-stream';

    try {
        const data = fs.readFileSync(filePath);
        res.writeHead(200, {
            'Content-Type': ct,
            'Access-Control-Allow-Origin': '*',
            'Cross-Origin-Opener-Policy': 'same-origin',
            'Cross-Origin-Embedder-Policy': 'require-corp',
        });
        res.end(data);
    } catch (e) {
        res.writeHead(404);
        res.end('Not found');
    }
});

async function run() {
    server.listen(PORT);
    log(`Server started on http://localhost:${PORT}`);

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const consoleLogs = [];

    page.on('console', msg => {
        const text = msg.text();
        consoleLogs.push(`[${msg.type()}] ${text}`);
        if (text.includes('[JVM]') || text.includes('Error') || text.includes('error') || text.includes('Loaded')) {
            log(`CONSOLE: ${text}`);
        }
    });

    page.on('pageerror', err => {
        log(`PAGE ERROR: ${err.message}`);
    });

    try {
        log('Loading page...');
        await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle', timeout: 30000 });
        await page.screenshot({ path: 'initial-load.png' });
        log('Page loaded, screenshot saved');

        const title = await page.title();
        log(`Title: ${title}`);

        const canvas = await page.$('#game-canvas');
        log(`Canvas found: ${!!canvas}`);

        const status = await page.$eval('#status', el => el.textContent).catch(() => 'N/A');
        log(`Status: ${status}`);

        await page.waitForFunction(() => {
            return document.getElementById('status').textContent.includes('JVM ready');
        }, { timeout: 30000 }).catch(() => {
            log('Timeout waiting for JVM ready');
        });

        const status2 = await page.$eval('#status', el => el.textContent).catch(() => 'N/A');
        log(`Status after wait: ${status2}`);

        const loader = await page.$('#loader');
        if (loader) {
            await loader.click();
            log('Clicked loader to start');
        }

        await page.waitForTimeout(3000);

        const status3 = await page.$eval('#status', el => el.textContent).catch(() => 'N/A');
        log(`Status after click: ${status3}`);

        await page.waitForFunction(() => {
            const s = document.getElementById('status').textContent;
            return s.includes('Loaded') || s.includes('Starting') || s.includes('Error') || s.includes('failed');
        }, { timeout: 120000 }).catch(() => {
            log('Timeout waiting for class loading');
            page.screenshot({ path: 'timeout.png' });
        });

        const status4 = await page.$eval('#status', el => el.textContent).catch(() => 'N/A');
        log(`Final status: ${status4}`);

        await page.screenshot({ path: 'final-state.png' });

        const checks = [];
        checks.push({ name: 'WASM module loaded', pass: consoleLogs.some(l => l.includes('WASM JVM')) });
        checks.push({ name: 'JVM init called', pass: consoleLogs.some(l => l.includes('initialised') || l.includes('initialized')) });
        checks.push({ name: 'JAR download started', pass: consoleLogs.some(l => l.includes('Downloading') || status4.includes('Loading')) });
        checks.push({ name: 'Canvas exists', pass: !!canvas });
        checks.push({ name: 'Status element works', pass: status.length > 0 });

        log('');
        log('=== CHECK RESULTS ===');
        let allPass = true;
        for (const c of checks) {
            log(`${c.pass ? 'PASS' : 'FAIL'}: ${c.name}`);
            if (!c.pass) allPass = false;
        }

        fs.writeFileSync('result.txt', RESULTS.join('\n') + '\n\n' + JSON.stringify(checks, null, 2));
        log(`Overall: ${allPass ? 'ALL PASSED' : 'SOME FAILED'}`);

    } catch (e) {
        log(`FATAL: ${e.message}`);
        await page.screenshot({ path: 'error.png' }).catch(() => {});
        fs.writeFileSync('result.txt', RESULTS.join('\n'));
    } finally {
        await browser.close();
        server.close();
        process.exit(0);
    }
}

run();
