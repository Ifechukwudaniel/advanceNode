const Page = require("./helper/Page")
let  page
const url = "http://localhost:3000"
 beforeEach( async ()=>{
    jest.setTimeout(100000)
    page = await Page.build()
    await page.goto(url)
 })

 afterEach( async ()=>{
   await page.close()
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
  await page.login()  
  const logoutText=  await page.$eval('a[href="/auth/logout"]', el=>el.innerHTML)
  expect(logoutText).toEqual("Logout")
})
