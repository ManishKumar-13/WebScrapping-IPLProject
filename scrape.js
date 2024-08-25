const puppeteer = require('puppeteer');
const fs = require('fs');
const xlsx = require('xlsx');

const scrapeData = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Adjust the URL as needed
  const url = 'https://www.iplt20.com/stats/';

  await page.goto(url, { waitUntil: 'networkidle2' });

  // Extract data
  const data = await page.evaluate(() => {
    const players = Array.from(document.querySelectorAll('.st-ply-name')); // Replace with actual class
    const runs = Array.from(document.querySelectorAll('.np-tableruns')); // Replace with actual class
    
    return players.map((player, index) => ({
      name: player.textContent.trim(),
      runs: runs[index] ? runs[index].textContent.trim() : 'N/A'
    }));
  });

  await browser.close();

  // Save to JSON
  fs.writeFileSync('players.json', JSON.stringify(data, null, 2));
  console.log('Data saved to players.json');

  // Save to Excel
  const workbook = xlsx.utils.book_new();
  const sheetData = xlsx.utils.json_to_sheet(data);
  xlsx.utils.book_append_sheet(workbook, sheetData, 'Players');
  xlsx.writeFile(workbook, 'players.xlsx');
  console.log('Excel sheet successfully created!');
};

scrapeData().catch(console.error);
