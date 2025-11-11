const https = require('https');

function fetchJson(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'node.js' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (err) {
                    reject(new Error('Failed to parse JSON response'));
                }
            });
        }).on('error', reject);
    });
}

async function main() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error('Usage: node index.js "City Name"');
        process.exit(1);
    }

    const city = args.join(' ');
    const url = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;

    try {
        const data = await fetchJson(url);
        const cur = data?.current_condition?.[0];
        if (!cur) {
            console.error(`No weather data found for "${city}".`);
            process.exit(1);
        }

        const tempC = cur.temp_C;
        const desc = (cur.weatherDesc && cur.weatherDesc[0] && cur.weatherDesc[0].value) || 'Unknown';
        console.log(`Weather in ${city}: ${tempC}°C, ${desc}`);
    } catch (err) {
        console.error('Error fetching weather:', err.message || err);
        process.exit(1);
    }
}

main();