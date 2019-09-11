 const puppeteer = require('puppeteer')

test('Adds to numbers ', () => {
     const sum = 4+1;
     expect(sum).toEqual(5);
})

test('Does browser start', async () => {
    const  browser =  await puppeteer.launch({
     headless:false
    })
    const page = await browser.newPage()
    await page.goto("http://localhost:3000")
    
}, 10000)

