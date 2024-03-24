const express = require('express')
const app = express()
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const routes = require('./routes/routes')
app.use(express.json())

app.listen(3000, function check(error){
    if(error) console.log("Server error ...")
    else console.log("Server started!")
})

mongoose.connect("mongodb://localhost:27017/ShareMyRecipe", {useNewUrlParser: true, useUnifiedTopology: true},
function checkDb(error){
    if(error) console.log("DB conection error ...")
    else { 
        console.log("DB conected")
    }
})




app.use(routes)