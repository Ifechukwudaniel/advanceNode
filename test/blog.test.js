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

describe('When logged in   is true',  async () => {
    beforeEach(async ()=>{
        await page.login()
        await  page.click('.btn-floating.btn-large.red')
    })

    test('Can see  form', async () => {
        const  formText =  await  page.getContentOf("form label")
        expect(formText).toEqual("Blog Title")
    })
    
    describe(' When using valid Form input', () => {
        beforeEach( async ()=>{
            await page.type(".title input", "My Title")
            await page.type(".content input", "My content")
            await page.click("form button")
        }) 
        test('The form Should confirm submit', async () => {
            const confirmText=  await page.getContentOf("h5")
            expect(confirmText).toEqual("Please confirm your entries")
        })
        
        test('The form Should submit blog', async() => {
            await page.click("button.green")
            await page.waitFor(".card")
            const title =  await page.getContentOf("span.card-title")
            const  contentText =  await page.getContentOf(".card-content p")
            expect(title).toEqual("My Title")
            expect(contentText).toEqual("My content")
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

describe('When user is not login', () => {
    test('Should not be able to create Post',async () => {
     const result = await page.evaluate(
     ()=>{
         return fetch("/api/blogs", {
            method:"POST",
            credentials:"same-origin",
            headers:{"Content-type": "application/json"},
            body:JSON.stringify({title:"My Title", content:"my  content"})
        })
        .then(res=>res.json())
     }
     )
      expect(result).toEqual({error:'You must log in!'})
    })

    test('should  not be able to get post', async () => {
      const result = await page.evaluate(
          ()=>{
              return fetch("/api/blogs", {
                method:'GET',
                credentials:"same-origin",
                headers:{"Content-type": "application/json"},
             })
             .then(res=>res.json())
          }
      )
       expect(result).toEqual({error:'You must log in!'})
    })
    
});