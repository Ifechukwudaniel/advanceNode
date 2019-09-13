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
    const text = await page.getContentOf("a.left.brand-logo")
    expect(text).toEqual('Blogster')
})

test('clicking login has oauth flow', async () => {
     await page.click((".right a"))
     const url = page.url()
     expect(url).toMatch(/accounts\.google\.com/)
})


test('When signed in,has logout button',  async() => {
  await page.login()  
  const logoutText=  await page.getContentOf('a[href="/auth/logout"]')
  expect(logoutText).toEqual("Logout")
})
