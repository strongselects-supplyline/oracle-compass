const puppeteer = require('puppeteer-core');
const fs = require('fs');
const { execSync } = require('child_process');

// Find system Chrome/Chromium to avoid downloading
const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

(async () => {
    try {
        const browser = await puppeteer.launch({ 
            executablePath: chromePath,
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
        });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        const urls = [
            "https://open.spotify.com/playlist/112cq4foxxt4igkkCBbhuj",
            "https://open.spotify.com/playlist/2CIlT1itynWeVOveOPT3Cy",
            "https://open.spotify.com/playlist/0Uu041FM6GIZ7XgOUfhJH5",
            "https://open.spotify.com/playlist/57YYPDVknqL11fhOkwik3r"
        ]; // Just doing 4 first to test

        const results = [];
        for (const url of urls) {
            console.log("Navigating to: " + url);
            await page.goto(url, { waitUntil: 'load', timeout: 30000 });
            await page.waitForTimeout(2000); // Wait for Client Side Rendering
            
            const tracks = await page.evaluate(() => {
                const trackNodes = document.querySelectorAll('div[data-testid="tracklist-row"]');
                const tList = [];
                trackNodes.forEach(rn => {
                    const nameNode = rn.querySelector('a[data-testid="internal-track-link"]');
                    const name = nameNode ? nameNode.innerText : null;
                    const artistsNodes = rn.querySelectorAll('a[href^="/artist/"]');
                    const numArtists = artistsNodes.length;
                    const artists = Array.from(artistsNodes).slice(Math.max(0, numArtists - 2)).map(an => an.innerText); // Usually track artist is first or last depending on DOM
                    if (name) tList.push({ name, artist: artists[0] || "Unknown" });
                });
                return tList;
            });
            console.log(`Found ${tracks.length} tracks for ${url}`);
            results.push({ url, playlistId: url.split('/').pop().split('?')[0], timestamp: new Date().toISOString(), tracks });
        }
        
        fs.writeFileSync('lib/matrix/metadata_raw.json', JSON.stringify(results, null, 2));
        await browser.close();
        console.log("Success");
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
