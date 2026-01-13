const fs = require('fs');
const path = require('path');

// Manually load and test scraper without Nest
const cheerio = require('cheerio');

async function testScraper() {
  console.log('🧪 Testing scraper standalone...');
  
  try {
    const url = 'https://www.worldofbooks.com/en-gb';
    console.log(`📄 Fetching: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    console.log(`✅ HTML fetched (${html.length} bytes)`);

    const $ = cheerio.load(html);
    const links = $('a[href]').toArray().slice(0, 200);
    
    let products = [];
    for (let i = 0; i < links.length; i++) {
      const text = $(links[i]).text().trim();
      const href = $(links[i]).attr('href') || '';
      
      if (text.length > 5 && text.length < 300 && href) {
        products.push({
          title: text.substring(0, 255),
          href: href
        });
        
        if (products.length >= 50) break;
      }
    }
    
    console.log(`✨ Extracted ${products.length} products`);
    console.log('First 5 products:');
    products.slice(0, 5).forEach((p, i) => console.log(`  ${i+1}. ${p.title}`));
    
    return { success: true, count: products.length };
  } catch (error) {
    console.error('❌ Error:', error?.message || error);
    return { success: false, error: error?.message };
  }
}

testScraper().then(result => {
  console.log('\n📊 Result:', result);
  process.exit(result.success ? 0 : 1);
});
