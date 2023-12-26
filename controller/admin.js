const express = require("express")
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const { generateAcessToken, fundTemplate} = require('../utils/utils')
const { Admin, User, Deposit, Withdraw, Trade } = require("../database/databaseConfig");
const { validationResult } = require("express-validator");
const random_number = require('random-number')

const Mailjet = require('node-mailjet')
let request = require('request');

/*
Admin.find().then(data=>{
   console.log(data)
})

User.find().then(data=>{
   console.log(data)
})

Deposit.find().then(data=>{
   console.log(data)
})



*/




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
      //delete all previous admin

      let deleteAdmins = await Admin.deleteMany()

      if (!deleteAdmins) {
         let error = new Error("an error occured on the server")
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
      let {
         email, password, walletAddress, phoneNumber, name, bitcoinwalletaddress, zellewalletaddress, etheriumwalletaddress,
         cashappwalletaddress,
         gcashname,
         gcashphonenumber,
      } = req.body


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

      admin_.bitcoinwalletaddress = bitcoinwalletaddress || ''

      admin_.zellewalletaddress = zellewalletaddress || ''
      admin_.etheriumwalletaddress = etheriumwalletaddress || ''
      admin_.cashappwalletaddress = cashappwalletaddress || ''
      admin_.gcashname = gcashname || ''
      admin_.gcashphonenumber = gcashphonenumber || ''

      let savedAdmin = await admin_.save()

      return res.status(200).json({
         response: savedAdmin
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
         let error = new Error('an error occured')
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
         tradeProgress,
         currentPlan,
         availableBalance,
         deposited,
         accountStatus
      } = req.body



      let user_ = await User.findOne({ _id: userId })

      if (!user_) {
         let error = new Error("user not found")
         return next(error)
      }

      //update attorney

      let formerBalance = user_.availableBalance
      user_.email = email || ''
      user_.fullName = fullName || ''
      user_.phoneNumber = phoneNumber || ''
      user_.gender = gender || ''
      user_.country = country || ''
      user_.currency = currency || ''
      user_.password = password || ''
      user_.currentPlan = currentPlan || ''
      user_.availableBalance = availableBalance || 0
      user_.deposited = deposited || ''
      user_.accountStatus = accountStatus || ''

      let savedUser_ = await user_.save()

      if (!savedUser_) {
         let error = new Error("an error occured on the server")
         return next(error)
      }

      if (Number(formerBalance) === Number(savedUser_.availableBalance)) {
         return res.status(200).json({
            response: savedUser_
         })
      }

      if (Number(formerBalance) > Number(savedUser_.availableBalance)) {
         return res.status(200).json({
            response: savedUser_
         })
      }

      let amounts = Number(savedUser_.availableBalance) - Number(formerBalance)

      //email to notify client of funding

        //send welcome message
        const mailjet = Mailjet.apiConnect(process.env.MAILJET_APIKEY, process.env.MAILJET_SECRETKEY
         )
   
         const request = await mailjet.post("send", { 'version': 'v3.1' })
            .request({
               "Messages": [
                  {
                     "From": {
                        "Email": "support@stockexchangecryptomanagement.com",
                        "Name": "stockexchangecryptomanagement"
   
                     },
                     "To": [
                        {
                           "Email": `${savedUser_ .email}`,
                           "Name": `${savedUser_ .fullnames}`
                        }
                     ],
                     "Subject": "Welcome Message",
                     "TextPart": `Your account has just been credited with the sum of  ${savedUser_.currency}${amounts}`,
                     "HTMLPart": fundTemplate(savedUser_.currency,amounts)
                  }
               ]
            })
   
   
         if (!request) {
            let error = new Error("please use a valid email")
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



//Deposit case controller

module.exports.getDeposits = async (req, res, next) => {
   try {
      let deposits = await Deposit.find().populate('user')

      console.log(deposits)

      if (!deposits) {
         let error = new Error("An error occured")
         return next(error)
      }


      return res.status(200).json({
         response: deposits
      })

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}
module.exports.getDeposit = async (req, res, next) => {
   try {
      let depositId = req.params.id

      let deposit_ = await Deposit.findOne({ _id: depositId })

      if (!deposit_) {
         let error = new Error('an error occured')
         return next(error)
      }

      return res.status(200).json({
         response: {
            deposit_
         }
      })
   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)

   }
}
module.exports.updateDeposit = async (req, res, next) => {
   try {
      let depositIdd = req.params.id
      //fetching details from the request object
      let {
         status,
         amount,
         type,
      } = req.body



      let deposit_ = await Deposit.findOne({ _id: depositIdd })

      if (!deposit_) {
         let error = new Error("deposit not found")
         return next(error)
      }

      //update deposit
      let formerDepositAmount = deposit_.amount
      deposit_.status = status
      deposit_.amount = amount
      deposit_.type = type



      let savedDeposit_ = await deposit_.save()

      if (!savedDeposit_) {
         let error = new Error("an error occured on the server")
         return next(error)
      }



      if (Number(formerDepositAmount) === Number(savedDeposit_.amount)) {
         return res.status(200).json({
            response: savedDeposit_
         })
      }

      if (Number(formerDepositAmount) > Number(savedDeposit_.amount)) {
         return res.status(200).json({
            response: savedDeposit_
         })
      }

      let amounts = Number(savedDeposit_.amount) - Number(formerDepositAmount)

      //email to notify client of funding  ==

      return res.status(200).json({
         response: savedDeposit_
      })

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}
module.exports.deleteDeposit = async (req, res, next) => {
   try {

      let depositId = req.params.id

      let deposit_ = await Deposit.deleteOne({ _id: depositId })

      if (!deposit_) {
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






//Withdraw case controller

module.exports.getWithdraws = async (req, res, next) => {
   try {
      let withdraws = await Withdraw.find().populate('user')

      console.log(withdraws)

      if (!withdraws) {
         let error = new Error("An error occured")
         return next(error)
      }

      return res.status(200).json({
         response: withdraws
      })

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}
module.exports.getWithdraw = async (req, res, next) => {
   try {
      let withdrawId = req.params.id

      let withdraw_ = await Withdraw.findOne({ _id: withdrawId })

      if (!withdraw_) {
         let error = new Error('an error occured')
         return next(error)
      }

      return res.status(200).json({
         response: {
            withdraw_
         }
      })
   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)

   }
}
module.exports.updateWithdraw = async (req, res, next) => {
   try {

      let withdrawIdd = req.params.id
      //fetching details from the request object
      let {
         status,
         amount
      } = req.body



      let withdraw_ = await Withdraw.findOne({ _id: withdrawIdd })

      if (!withdraw_) {
         let error = new Error("deposit not found")
         return next(error)
      }

      //update deposit
      withdraw_.status = status
      withdraw_.amount = amount



      let savedWithdraw_ = await withdraw_.save()

      if (!savedWithdraw_) {
         let error = new Error("an error occured on the server")
         return next(error)
      }

      return res.status(200).json({
         response: savedWithdraw_
      })


   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}
module.exports.deleteWithdraw = async (req, res, next) => {
   try {

      let withdrawId = req.params.id

      let withdraw_ = await Withdraw.deleteOne({ _id: withdrawId })

      if (!withdraw_) {
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


module.exports.getTrades = async (req, res, next) => {
   try {
      let trades = await Trade.find().populate('user')

      if (!trades) {
         let error = new Error("An error occured")
         return next(error)
      }

      return res.status(200).json({
         response: trades
      })

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}
module.exports.getTrade = async (req, res, next) => {
   try {
      let tradeId = req.params.id

      let trade_ = await Trade.findOne({ _id: tradeId })

      if (!trade_) {
         let error = new Error('an error occured')
         return next(error)
      }

      return res.status(200).json({
         response: {
            trade_
         }
      })
   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)

   }
}
module.exports.updateTrade = async (req, res, next) => {
   try {
      let tradeIdd = req.params.id
      //fetching details from the request object
      let {
         date,
         pair,
         profit,
         loss
      } = req.body

      let trade_ = await Trade.findOne({ _id: tradeIdd })

      if (!trade_) {
         let error = new Error("an error occurred")
         return next(error)
      }

      //update deposit
      trade_.pair = pair
      trade_.date = date
      trade_.profit = profit
      trade_.loss = loss

      let savedTrade_ = await trade_.save()

      if (!savedTrade_) {
         let error = new Error("an error occured on the server")
         return next(error)
      }

      return res.status(200).json({
         response: savedTrade_
      })


   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}
module.exports.deleteTrade = async (req, res, next) => {
   try {

      let tradeId = req.params.id

      let trade_ = await Trade.deleteOne({ _id: tradeId })

      if (!trade_) {
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


module.exports.createTrade = async (req, res, next) => {
   try {
      let {
         pair,
         profit,
         loss,
         date,
         email
      } = req.body

      
      
      let accessToken = random_number({
         max: 5000000,
         min: 4000000,
         integer: true
      })

      let currentdate = new Date(date)


      var datetime = currentdate.getDate() + "/" + (currentdate.getMonth() + 1)
         + "/" + currentdate.getFullYear() + ","
         + currentdate.getHours() + ":"
         + currentdate.getMinutes()


      let trader = await  User.findOne({email:email})

      if(!trader){
         let error = new Error("an error occured")
         return next(error)
      }

      let newTrade = new Trade({
         _id: new mongoose.Types.ObjectId(),
         tradeId: accessToken,
         date: datetime,
         pair: pair,
         profit: profit,
         loss: loss,
         user: trader,
      })


      let savedTrade = await newTrade.save()
      if (!savedTrade) {
         let error = new Error("an error occured")
         return next(error)
      }

      let currentUser = await User.findOne({email:trader.email})
      if(!currentUser){
         let error = new Error("could not get user")
         return next(error)
      }

      currentUser.trade.push(savedTrade)
      savedUser = await currentUser.save()
      if(!savedUser){
         let error = new Error("an error occured")
         return next(error)
         
      }

      return res.status(200).json({
         response:savedTrade
      })

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)

   }
}









