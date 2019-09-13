const Page = require("./helper/Page")
let page 
const url = "http://localhost:3000"

beforeEach ( async()=>{
    page=   await Page.build() 
    await page.goto(url) 
})

afterEach( async ()=>{
   page.close()
})