const fs = require('fs');

const files = [
  'index.html',
  'oppdag.html',
  'deals.html',
  'varsler.html',
  'historikk.html'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Check if it actually contains the mojibake
    if (content.includes('Ã')) {
      // Decode: target string was double-encoded.
      // E.g., 'ø' (C3 B8) -> 'Ã¸' (C3 83 C2 B8)
      // Convert JS string -> Latin1 bytes -> UTF8 string
      let fixedContent = Buffer.from(content, 'latin1').toString('utf8');
      
      // Let's ensure it doesn't crash on characters that weren't mangled, 
      // though typically the whole file was read/written wrong.
      // Wait, is it safe to convert the whole file like this?
      // Only if the ONLY characters > 127 in the current file are the mangled ones.
      // Yes, because initially it was UTF-8, read as Win1252, written as UTF-8.
      // So every byte > 127 in the original file became a char > 127 in Win1252, 
      // which then became a UTF-8 sequence. 
      // Let's test it first.
      fs.writeFileSync('test_' + file, fixedContent, 'utf8');
      console.log('Fixed', file);
    }
  }
});
