const cheerio = require('cheerio');

console.log('Testing fetch + Cheerio parsing...');

fetch('https://www.worldofbooks.com/en-gb', {
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
  timeout: 5000
})
.then(r => r.text())
.then(html => {
  const $ = cheerio.load(html);
  const links = $('a[href]').toArray().slice(0, 200);
  
  let extracted = [];
  for (let i = 0; i < links.length; i++) {
    const text = $(links[i]).text().trim();
    const href = $(links[i]).attr('href') || '';
    if (text.length > 5 && text.length < 300 && href) {
      extracted.push({ text: text.substring(0, 50), href: href.substring(0, 50) });
      if (extracted.length >= 15) break;
    }
  }
  
  console.log('Found', extracted.length, 'products:');
  extracted.forEach((p, i) => console.log((i+1) + '. ' + p.text + ' -> ' + p.href));
})
.catch(e => console.error('ERROR:', e.message));
