 const puppeteer = require('puppeteer')
 let browser , page
 const url = "http://localhost:3000"
 const sessionFactory = require("./factories/sessionFactories")
 const userFactory = require("./factories/userFactories")


 beforeEach( async ()=>{
    jest.setTimeout(100000)
    browser =  await puppeteer.launch({
        headless:false
    })
    page = await browser.newPage()
    await page.goto(url)
 })

 afterEach( async ()=>{
   await browser.close()
 })

test('The header has the correct text', async () => {
    const text = await page.$eval("a.left.brand-logo", el=> el.innerHTML)
    expect(text).toEqual('Blogster')
})

test('clicking login has oauth flow', async () => {
     await page.click((".right a"))
     const url = page.url()
     expect(url).toMatch(/accounts\.google\.com/)
})


test('When signed in,has logout button',  async() => {
  const newUser = await userFactory()
  const { session , sign} = sessionFactory(newUser)
  await page.setCookie({ name:'session', value: session})
  await page.setCookie({name: 'session.sig', value:sign })
  await page.goto(url)
  await page.waitFor('a[href="/auth/logout"]')
  const logoutText=  await page.$eval('a[href="/auth/logout"]', el=>el.innerHTML)
  expect(logoutText).toEqual("Logout")
})
