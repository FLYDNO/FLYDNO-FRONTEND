const fs = require('fs');

const files = [
    'index.html',
    'oppdag.html',
    'deals.html',
    'varsler.html',
    'historikk.html'
];

files.forEach(f => {
    if (fs.existsSync(f)) {
        let c = fs.readFileSync(f, 'utf8');

        c = c.replace(/Ã¸/g, "ø").replace(/Ã˜/g, "Ø");
        c = c.replace(/Ã¥/g, "å").replace(/Ã…/g, "Å");
        c = c.replace(/Ã¦/g, "æ").replace(/Ã†/g, "Æ");
        c = c.replace(/Ã¨/g, "è").replace(/Ã©/g, "é");
        c = c.replace(/Ã¡/g, "á");
        c = c.replace(/Â/g, "");

        // Emojis
        c = c.replace(/ðŸ‡ªðŸ‡º/g, "🇪🇺");
        c = c.replace(/ðŸ‡¨ðŸ‡¿/g, "🇨🇿");
        c = c.replace(/ðŸ‡\xADðŸ‡·/g, "🇭🇷");
        c = c.replace(/ðŸ‡ªðŸ‡¬/g, "🇪🇬");
        c = c.replace(/ðŸ‡²ðŸ‡»/g, "🇲🇻");
        c = c.replace(/ðŸ‡ªðŸ‡ª/g, "🇪🇪");
        c = c.replace(/ðŸ‡¨ðŸ‡´/g, "🇨🇴");

        c = c.replace(/ðŸŒ\x8D/g, "🌍");
        c = c.replace(/ðŸŒŽ/g, "🌎");
        c = c.replace(/ðŸŒ\x8F/g, "🌏");

        c = c.replace(/â€¢/g, "•");
        c = c.replace(/â€“/g, "–");
        c = c.replace(/â€”/g, "—");
        c = c.replace(/â‚¬/g, "€");
        c = c.replace(/â†’/g, "→");

        c = c.replace(/ðŸ‡ªðŸ‡\x88/g, "🇪🇸");
        c = c.replace(/ðŸ‡¬ðŸ‡§/g, "🇬🇧");
        c = c.replace(/ðŸ‡¹ðŸ‡\xAD/g, "🇹🇭");
        c = c.replace(/ðŸ‡ºðŸ‡\x8B/g, "🇺🇸");
        c = c.replace(/ðŸ‡¯ðŸ‡\x85/g, "🇯🇵");
        c = c.replace(/ðŸ‡®ðŸ‡\xB9/g, "🇮🇹");
        c = c.replace(/ðŸ‡¦ðŸ‡ª/g, "🇦🇪");
        c = c.replace(/ðŸ‡«ðŸ‡·/g, "🇫🇷");
        c = c.replace(/ðŸ‡©ðŸ‡ª/g, "🇩🇪");

        c = c.replace(/x!x!/g, "🇪🇺"); // Provide a safe fallback if replacement string causes issues

        fs.writeFileSync(f, c, 'utf8');
    }
});
console.log("Replaced via node.");
