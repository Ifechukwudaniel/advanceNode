 const puppeteer = require('puppeteer')
 let browser , page

 beforeEach( async ()=>{
    browser =  await puppeteer.launch({
        headless:false
    })
    page = await browser.newPage()
    await page.goto("http://localhost:3000")
 })

 afterEach( async ()=>{
     await browser.close()
 })

test('The header has the correct text', async () => {
    const text = await page.$eval("a.left.brand-logo", el=> el.innerHTML)
    expect(text).toEqual('Blogster')
}, 10000)

test('clicking login hs oauth flow', async () => {
     await page.click((".right a"))
     const url = page.url()
     expect(url).toMatch(/accounts\.google\.com/)
})
