const Buffer = require("safe-buffer").Buffer
const keyGrip = require('keygrip');
const key = require("../../config/keys");
const keygrip = new keyGrip([key.cookieKey])

module.exports=(user)=>{
    const sessionObject = {
        passport:{
            user: user._id.toString()
        }
    } 
    const session =  Buffer.from(JSON.stringify(sessionObject)).toString("base64")
    const sign = keygrip.sign(`session=${session}`)
    return {session, sign}
} 