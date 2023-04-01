//jshint esversion:6

import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

const app = express()
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.listen(3000, (req, res) =>{
    console.log('listening on port 3000')
})