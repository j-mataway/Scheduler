const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const cors = require('cors')
const PORT = 8000
require('dotenv').config()


MongoClient.connect(process.env.DATABASE_URL,  {useUnifiedTopology:true})  
    .then(client => {
        console.log('Connected to DB')
        const db = client.db('scheduler')
        const userCollection = db.collection('users')
        app.set('view engine', 'ejs')
        app.use(express.static(__dirname + '/public'))
        app.use(express.urlencoded({ extended: true }))
        app.use(express.json())
       
       
        app.get('/', (req, res) =>{
            res.render(__dirname + '/views/login.ejs')
        })
        app.get('/manager', (req, res) =>{
            res.render(__dirname + '/views/manager.ejs')
        })
        
        


        app.post('/users', (req, res) =>{
            userCollection.insertOne(req.body)
                .then(result => {
                    res.redirect('/manager')
                })
                .catch(error => console.error(error))
        })




        app.listen(process.env.PORT || PORT, _ =>{
            console.log(`Listening on port ${PORT}`)
        })
  })
  .catch(error => console.error(error))

