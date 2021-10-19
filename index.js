const puppeteer = require('puppeteer');
const fs = require('fs')
const {URL_TO_SCRAPE} = require('./constant')

let scrape = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(URL_TO_SCRAPE);
  
  
  const ingredientList = await page.evaluate(() => {

    const list = document.querySelectorAll('div.index-item-card > a')
    let data = []
    list.forEach(element => {
      data.push({
        title: element.innerText,
        imageUrl: element.children[0].getAttribute('src'),
      })
      
    });  
    return data;
    })
    
  

  
  await browser.close();
  return ingredientList;
};

scrape().then((value) => {
  fs.writeFile(
    './ingredientList.json',
    JSON.stringify(value),
    function (err) {
      if (err) return console.log(err);
    });

});