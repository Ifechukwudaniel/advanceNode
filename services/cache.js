const util = require("util")
const redis = require("redis")
const redisUrl = "redis://127.0.0.1:6379"
const redisClient = redis.createClient(redisUrl)
redisClient.get = util.promisify(redisClient.get);
const mongoose = require("mongoose")

let exec = mongoose.Query.prototype.exec

mongoose.Query.prototype.cache=  function () {
   this.useCache = true
}

mongoose.Query.prototype.exec= async  function () {
     let key =  JSON.stringify(
          Object.assign({}, this.getQuery(), { collection: this.mongooseCollection.name})
     )
     //  See if we  the value for key in redis 
     const cachedValue =  await redisClient.get(key)
     
     if (cachedValue) {
        const doc = JSON.parse(cachedValue)
        return Array.isArray(doc) 
        ? doc.map(d=> this.model(d)) 
        : this.model(doc)
     }
    const result = await exec.apply(this, arguments)
     redisClient.set(key , JSON.stringify(result))
      //console.log(result)
    return result
} 