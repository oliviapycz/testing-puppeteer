const puppeteer = require('puppeteer');
const fs = require('fs')
const {URL_TO_SCRAPE} = require('./constant')

const getAllUrlForOneLetter = async browser => {
  const page = await browser.newPage()
  await page.goto(URL_TO_SCRAPE)
  await page.waitFor('body')
  const result = await page.evaluate(() =>
    [...document.querySelectorAll('nav.af-pagination> ul > li > a')].map(link => link.href),
  )
  return result
}
  
const getDataFromUrl = async (browser, url) => {
  const page = await browser.newPage()
  await page.goto(url)
  await page.waitFor('body')
  return page.evaluate(() => {
    let data = []
      
    const list = document.querySelectorAll('div.index-item-card > a')
    list.forEach(element => {
      data.push({
        title: element.innerText,
        imageUrl: element.children[0].getAttribute('src'),
      })
    });  
    return data;
  })
}

const scrape = async () => {
  const browser = await puppeteer.launch({ headless: false })
  const urlList = await getAllUrlForOneLetter(browser)
  const results = await Promise.all(
    urlList.map(url => getDataFromUrl(browser, url)),
  )
  browser.close()
  return results
}


scrape().then((value) => {
  fs.writeFile(
    './ingredientList.json',
    JSON.stringify(value),
    function (err) {
      if (err) return console.log(err);
    });

});
