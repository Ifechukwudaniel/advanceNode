const mongoose = require("mongoose");
const keys = require("../config/keys")
jest.setTimeout(30000)

require("../models/User")
mongoose.Promise= global.Promise
mongoose.connect(keys.mongoURI, {useMongoClient: true})