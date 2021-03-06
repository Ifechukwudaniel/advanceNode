const util = require("util")
const redis = require("redis")
const keys = require("../config/keys")
const redisUrl = keys.redisUrl
const redisClient = redis.createClient(redisUrl)
redisClient.hget = util.promisify(redisClient.hget);
const mongoose = require("mongoose")

let exec = mongoose.Query.prototype.exec

mongoose.Query.prototype.cache=  function ( options = {}) {
   this.useCache = true
    this.hashedKey = JSON.stringify(options.key || "badKey")
   return this
}

mongoose.Query.prototype.exec= async  function () {
     if (!this.useCache) {
          return exec.apply(this, arguments) 
     }
     let key =  JSON.stringify(
          Object.assign({}, this.getQuery(), { collection: this.mongooseCollection.name})
     )
     //  See if we  the value for key in redis 
     const cachedValue =  await redisClient.hget(this.hashedKey , key)
     
     if (cachedValue) {
        const doc = JSON.parse(cachedValue)
        return Array.isArray(doc) 
        ? doc.map(d=> this.model(d)) 
        : this.model(doc)
     }
     const result = await exec.apply(this, arguments)
     redisClient.hset(this.hashedKey, key , JSON.stringify(result), 'EX', 10)
      //console.log(result)
    return result
} 

module.exports= {
  clearHash(hashKey){
     redisClient.del(JSON.stringify(hashKey))
  }
}