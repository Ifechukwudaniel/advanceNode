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

describe('When logedin   is true',  async () => {
    beforeEach(async ()=>{
        await page.login()
        await  page.click('.btn-floating.btn-large.red')
    })

    test('Can see  form', async () => {
        const  formText =  await  page.getContentOf("form label")
        expect(formText).toEqual("Blog Title")
    })
    
    describe(' When using valid Form input', () => {
        test('The form does not show error message ', () => {
          
        })
        
    });

    describe(' When using invalid form input', () => {
        beforeEach(async ()=>{
            await page.click("form button")
        })
         test('The form should shows error message', async () => {
           const titleMsg = await page.getContentOf(".title .red-text")
           const contentMsg = await page.getContentOf(".content .red-text")
           expect(titleMsg).toEqual("You must provide a value")
           expect(contentMsg).toEqual("You must provide a value")
         })
         
    });
});