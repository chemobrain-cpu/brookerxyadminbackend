const express = require("express")
const router = express.Router()
const app = express()
const ejs = require("ejs")
const bodyParser = require("body-parser")
const path = require("path")
const fs = require("fs")
const { verifyAdmin} = require("../utils/utils")
const { body, validationResult, Result } = require('express-validator')


let login = require("../controller/admin").login
let signup = require("../controller/admin").signup

let getAdmin = require("../controller/admin").getAdmin
let updateAdmin = require("../controller/admin").updateAdmin


let getUsers = require("../controller/admin").getUsers
let getUser = require("../controller/admin").getUser
let updateUser = require("../controller/admin").updateUser
let deleteUser = require("../controller/admin").deleteUser


//auth routes

router.post('/adminlogin',login)
router.post('/adminsignup',signup)




//Admin Routes
router.get('/admin/:id',verifyAdmin,getAdmin)
router.patch('/admin/:id',verifyAdmin,updateAdmin)

//User Routes
router.get('/users',verifyAdmin,getUsers)
router.get('/users/:id',verifyAdmin,getUser)
router.patch('/users/:id',verifyAdmin,updateUser)
router.delete('/users/:id',verifyAdmin,deleteUser)



exports.router = router