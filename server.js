const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const cors = require('cors')
const PORT = 8000
const session = require('express-session')
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
        app.use(session({secret:process.env.SESSION_SECRET, resave:false, saveUninitialized:true}))
       
       
        app.get('/', (req, res) =>{
            res.render(__dirname + '/views/login.ejs')
        })
        app.get('/manager', (req, res) =>{
            res.render(__dirname + '/views/manager.ejs')
        })
        
       
        //login 
        app.post('/getUsers', (req, res) =>{
            const username = req.body.username
            const password = req.body.password
            userCollection.findOne({username: username, password: password}, function(err, user){
                if (err) {
                    console.error(error)
                    return res.status(500).send()
                }
                if(!user){     
                    return res.redirect('/')
                }
                req.session.user = user
                return res.redirect('/manager')
                

            })
        })

        app.get('/dashboard', (req, res) => {
            if(!req.session.user){
                return res.status(401).send()
            }
            return res.send(req.session.user)
        })

        app.get('/logout', (req, res) =>{
            req.session.destroy()
            return res.status(200).send()
        })


        //adding a new user
        app.post('/users', (req, res) =>{
           //create username from first and last name entries
            const username = `${req.body.firstName[0].toLowerCase()}${req.body.lastName.toLowerCase()}`
            req.body.username = username
            //add to db
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

