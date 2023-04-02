require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")

const app = express()
app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }))
const bcrypt = require("bcrypt")
const saltRounds = 10

mongoose
	.connect("mongodb://127.0.0.1:27017/usersDB")
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.log(err))

const usersSchema = new mongoose.Schema({
	username: String,
	password: String,
})

usersSchema.plugin(encrypt, {
	secret: process.env.SECRET,
	encryptedFields: ["password"],
})

const User = mongoose.model("User", usersSchema)

app.get("/", (req, res) => {
	res.render("home")
})

app.get("/login", (req, res) => {
	res.render("login")
})

app.get("/register", (req, res) => {
	res.render("register")
})

app.post("/register", (req, res) => {
	const username = req.body.username
	const password = req.body.password

	bcrypt.hash(password, saltRounds).then(function (hash) {
		const newUser = new User({
			username: username,
			password: hash,
		})
		newUser
			.save()
			.then(() => res.render("secrets"))
			.catch((error) => console.log(error))
	})
})

app.post("/login", (req, res) => {
	const username = req.body.username
	const password = req.body.password

	User.findOne({ username: username }).then((foundUser) => {
		if (foundUser) {
			bcrypt.compare(password, foundUser.password).then(function(result) {
				if (result) {
					res.render("secrets")
				} else {
					console.log("Passwords do not match")
				}
			});
		} else {
			console.log(`Account not found`)
		}
	})
})

app.listen(3000, (req, res) => {
	console.log("listening on port 3000")
})
