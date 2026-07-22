const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Login
  await page.goto('http://localhost:3000/admin/login');
  await page.type('input[type="email"]', 'admin');
  await page.type('input[type="password"]', 'password');
  await page.click('button[type="submit"]');
  await page.waitForNavigation();
  
  // Go to Hotels tab
  await page.evaluate(() => {
    document.querySelectorAll('.sidebarItem').forEach(el => {
      if(el.innerText.includes('Hotels')) el.click();
    });
  });
  await new Promise(r => setTimeout(r, 1000));
  
  // Click Blanket Hotel
  await page.evaluate(() => {
    document.querySelectorAll('.listItemTitle').forEach(el => {
      if(el.innerText.includes('Blanket Hotel')) el.click();
    });
  });
  await new Promise(r => setTimeout(r, 2000));
  
  // Find Blanket Presidential Suite Edit button
  await page.evaluate(() => {
    const cards = document.querySelectorAll('.roomCard');
    cards.forEach(card => {
      if(card.innerText.includes('Blanket Presidential Suite')) {
        card.querySelector('button').click();
      }
    });
  });
  await new Promise(r => setTimeout(r, 1000));
  
  // Uncheck some amenities
  await page.evaluate(() => {
    const checkboxes = document.querySelectorAll('.tagLabel input[type="checkbox"]');
    checkboxes.forEach(cb => {
      // Uncheck TV and Mini Bar and Balcony and Jacuzzi and Safe and Dining Area and Kitchenette
      if(cb.nextElementSibling.innerText !== 'Wifi' && cb.nextElementSibling.innerText !== 'AC') {
        if(cb.checked) cb.click();
      }
    });
  });
  await new Promise(r => setTimeout(r, 500));
  
  // Click Save Room Category
  await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    btns.forEach(b => {
      if(b.innerText === 'Save Room Type' || b.innerText === 'Save Room Category') {
        b.click();
      }
    });
  });
  await new Promise(r => setTimeout(r, 1000));
  
  // Setup request interception
  await page.setRequestInterception(true);
  page.on('request', request => {
    if (request.url().includes('/api/hotels/blanket-hotel-spa-munnar') && request.method() === 'PUT') {
      console.log('PAYLOAD:', request.postData());
    }
    request.continue();
  });
  
  // Click Save Changes
  await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    btns.forEach(b => {
      if(b.innerText === 'Save Changes') {
        b.click();
      }
    });
  });
  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
})();
