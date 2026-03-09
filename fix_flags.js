const fs = require('fs');

const flags = {
    'Barcelona': 'es',
    'London': 'gb',
    'Bangkok': 'th',
    'New York': 'us',
    'Tokyo': 'jp',
    'Roma': 'it',
    'Dubai': 'ae',
    'Paris': 'fr',
    'Berlin': 'de',
    'Aten': 'gr',
    'Lisboa': 'pt',
    'Bali': 'id',
    'Singapore': 'sg',
    'Marrakech': 'ma',
    'Istanbul': 'tr',
    'Toronto': 'ca',
    'Sydney': 'au',
    'Reykjavik': 'is',
    'Cape Town': 'za',
    'Amsterdam': 'nl',
    'Mexico City': 'mx',
    'Mumbai': 'in',
    'Seoul': 'kr',
    'Rio de Janeiro': 'br',
    'Oslo': 'no',
    'Bergen': 'no',
    'Zürich': 'ch',
    'Genève': 'ch',
    'Europa': 'eu',
    'Melbourne': 'au',
    'Alicante': 'es',
    'Chania': 'gr'
};

const unicodeFlags = {
    'Praha': '🇨🇿',
    'Dubrovnik': '🇭🇷',
    'Kairo': '🇪🇬',
    'Maldivene': '🇲🇻',
    'Tallinn': '🇪🇪',
    'Bogotá': '🇨🇴'
};

function getFlagStr(city) {
    if (flags[city]) {
        return `<span class="fi fi-${flags[city]} fis" style="width:1.1em;height:0.85em;display:inline-block;vertical-align:middle;margin-bottom:1px;border-radius:2px;"></span>`;
    }
    if (unicodeFlags[city]) {
        return unicodeFlags[city];
    }
    return ''; // Default if not found
}

const files = [
    'index.html',
    'oppdag.html',
    'deals.html',
    'varsler.html',
    'historikk.html'
];

files.forEach(file => {
    if (fs.existsSync(file)) {
        let c = fs.readFileSync(file, 'utf8');

        // Fix index.html DESTS array occurrences
        Object.keys(unicodeFlags).forEach(city => {
            let regex = new RegExp(`\\{ f: '[^']+', n: '${city}' \\}`, 'g');
            c = c.replace(regex, `{ f: '${unicodeFlags[city]}', n: '${city}' }`);
        });

        // Fix oppdag.html card headers:
        // e.g. <h4 class="font-bold text-base">Bangkok x!x!</h4>
        c = c.replace(/<h4 class="font-bold text-base">([a-zA-Z\s]+?)\s+[^<]+<\/h4>/g, (match, p1) => {
            const city = p1.trim();
            const flag = getFlagStr(city);
            return `<h4 class="font-bold text-base">${city} ${flag}</h4>`;
        });

        // Fix oppdag.html filter button:
        // <span class="ms text-base">x!x!</span> Europa
        c = c.replace(/<span class="ms text-base">[^<]+<\/span>\s*Europa/g, `<span class="ms text-base">🇪🇺</span> Europa`);

        fs.writeFileSync(file, c, 'utf8');
        console.log(`Processed ${file}`);
    }
});
