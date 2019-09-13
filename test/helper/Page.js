const puppeteer = require('puppeteer');
const url = "http://localhost:3000"
const sessionFactory = require("../factories/sessionFactories")
const userFactory = require("../factories/userFactories")

class Page {
    static async build(){
        const browser = await puppeteer.launch({
            headless:false
        })
        const page =   await  browser.newPage()   
        const customPage = new Page(page)
       return new Proxy(customPage, {
           get: function (target , properties){
               return  target[properties] ||  browser[properties] || page[properties]
           }
       })
     }

     constructor(page, url) {
         this.url = url
         this.page = page
     }

     async login(){
        const user = await userFactory()
        const  {session, sign} = sessionFactory(user)
        this.page.setCookie({name:"session" , value:session})
        this.page.setCookie({name:'session.sig', value:sign})
        this.page.goto("http://localhost:3000")
        this.page.waitFor('a[href="/auth/logout"]')
    }
      
}

module.exports= Page