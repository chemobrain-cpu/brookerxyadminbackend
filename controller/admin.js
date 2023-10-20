const express = require("express")
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const { generateAcessToken } = require('../utils/utils')
const { Admin, User } = require("../database/databaseConfig");
const { validationResult } = require("express-validator");


module.exports.getAdminFromJwt = async (req, res, next) => {
   try {
      let token = req.headers["header"]
      if (!token) {
         throw new Error("a token is needed ")
      }
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY)

      const admin = await Admin.findOne({ email: decodedToken.email })

      if (!admin) {
         //if user does not exist return 404 response
         return res.status(404).json({
            response: "admin has been deleted"
         })
      }

      return res.status(200).json({
         response: {
            admin: admin,
         }
      })

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }

}


module.exports.signup = async (req, res, next) => {
   try {
      //email verification
      let { password, email, secretKey } = req.body

      //checking for validation error
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
         let error = new Error("invalid user input")
         return next(error)
      }

      //check if the email already exist
      let adminExist = await Admin.findOne({ email: email })

      if (adminExist) {
         let error = new Error("admin is already registered")
         //setting up the status code to correctly redirect user on the front-end
         error.statusCode = 301
         return next(error)
      }


      //check for secretkey
      if (secretKey !== 'brooker') {
         let error = new Error("secretKey mismatched")
         error.statusCode = 300
         return next(error)
      }


      //hence proceed to create models of admin and token
      let newAdmin = new Admin({
         _id: new mongoose.Types.ObjectId(),
         email: email,
         password: password,
      })

      let savedAdmin = await newAdmin.save()

      if (!savedAdmin) {
         //cannot save user
         let error = new Error("an error occured")
         return next(error)
      }

      let token = generateAcessToken(email)

      //at this point,return jwt token and expiry alongside the user credentials
      return res.status(200).json({
         response: {
            admin: savedAdmin,
            token: token,
            expiresIn: '500',
         }
      })


   } catch (error) {
      console.log(error)
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}

module.exports.login = async (req, res, next) => {
   try {
      let { email, password } = req.body
      //checking for validation error
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
         let error = new Error("invalid user input")
         return next(error)
      }

      let adminExist = await Admin.findOne({ email: email })


      if (!adminExist) {
         return res.status(404).json({
            response: "admin is not yet registered"
         })
      }



      //check if password corresponds
      if (adminExist.password != password) {
         let error = new Error("Password does not match")
         return next(error)
      }

      let token = generateAcessToken(email)

      //at this point,return jwt token and expiry alongside the user credentials
      return res.status(200).json({
         response: {
            admin: adminExist,
            token: token,
            expiresIn: '500',
         }
      })


   } catch (error) {
      console.log(error)
      error.message = error.message || "an error occured try later"
      return next(error)

   }
}

//admin routes
module.exports.getAdmin = async (req, res, next) => {

   try {
      let adminId = req.params.id

      let admin_ = await Admin.findOne({ _id: adminId })


      if (!admin_) {
         let error = new Error("user not found")
         return next(error)
      }

      return res.status(200).json({
         response: {
            admin_
         }
      })
   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)

   }
}

module.exports.updateAdmin = async (req, res, next) => {
   try {
      let { email, password,walletAddress,phoneNumber,name } = req.body
      let adminId = req.params.id

      let admin_ = await Admin.findOne({ _id: adminId })

      if (!admin_) {
         let error = new Error("user not found")
         return next(error)
      }

      //update admin

      admin_.email = email || ''
      admin_.password = password || ''
      admin_.walletAddress = walletAddress || ''
      admin_.phoneNumber = phoneNumber || ''
      admin_.name = name || ''

      let savedAdmin = await admin_.save()

      return res.status(200).json({
         response:savedAdmin
      })


   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)

   }
}


//user case controller

module.exports.getUsers = async (req, res, next) => {

   try {
      let users = await User.find()

      if (!users) {
         let error = new Error("An error occured")
         return next(error)
      }

      console.log(users)

      return res.status(200).json({
         response: users
      })

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}

module.exports.getUser = async (req, res, next) => {
   try {
      let userId = req.params.id

      let user_ = await User.findOne({ _id: userId })

      if (!user_) {
         let error = new Error("attorney not found")
         return next(error)
      }

      return res.status(200).json({
         response: {
            user_
         }
      })
   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)

   }
}
module.exports.updateUser = async (req, res, next) => {
   try {

      let userId = req.params.id
      //fetching details from the request object
      let {
         email,
         fullName,
         phoneNumber,
         gender,
         country,
         currency,
         password,
         proofUrl,
         passportUrl,
         idCardUrl,
         tradeProgress,
         currentPlan,
         availableBalance,
         profit,
         deposited,
         accountStatus
      } = req.body



      let user_ = await User.findOne({ _id: userId })

      if (!user_) {
         let error = new Error("attorney not found")
         return next(error)
      }

      //update attorney

      user_.email = email || ''
      user_.fullName = fullName || ''
      user_.phoneNumber = phoneNumber || ''
      user_.gender = gender || ''
      user_.country = country || ''
      user_.currency = currency|| ''
      user_.password = password|| ''
      user_.proofUrl = proofUrl|| ''
      user_.passportUrl = passportUrl|| ''
      user_.idCardUrl = idCardUrl|| ''
      user_.tradeProgress = tradeProgress|| ''
      user_.currentPlan = currentPlan|| ''
      user_.availableBalance = availableBalance || ''
      user_.profit = profit || ''
      user_.deposited = deposited|| ''
      user_.accountStatus = accountStatus|| ''
     
      

      let savedUser_ = await user_.save()

      if (!savedUser_) {
         let error = new Error("an error occured on the server")
         return next(error)
      }

      return res.status(200).json({
         response: savedUser_
      })

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}
module.exports.deleteUser = async (req, res, next) => {
   try {

      let userId = req.params.id

      let user_ = await User.deleteOne({ _id: userId })

      if (!user_) {
         let error = new Error("an error occured")

         return next(error)
      }
      return res.status(200).json({
         response: {
            message: 'deleted successfully'
         }
      })
   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)

   }
}


