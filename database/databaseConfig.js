const mongoose = require("mongoose")

mongoose.connect(process.env.DB_STRING).then(() => {
    //console.log("connected to database")
})

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
    },
    fullName: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    gender: {
        type: String,
    },
    country: {
        type: String,
    },
    currency: {
        type: String,
    },
    password: {
        type: String,
    },
 
    tradeProgress: {
        type: Number,
        default: 0
    },
    currentPlan: {
        type: String,
        default: 'starter'
    },
    availableBalance: {
        type: Number,
        default: 0
    },
    bonus: {
        type: Number,
        default: 50
    },

    deposited: {
        type: Number,
        default: 0
    },
    accountType: {
        type: String,
        default: 'Live trading account'
    },
    accountStatus: {
        type: String,
        default: 'inactive'
    },
    deposit: [{
        type: mongoose.Types.ObjectId,
        ref: "Deposit"
    }],
    withdraw: [{
        type: mongoose.Types.ObjectId,
        ref: "Withdraw"
    }],
   
})

const adminSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
    },
    password: {
        type: String
    },
    walletAddress: {
        type: String
    },
    bitcoinwalletaddress: {
        type: String
    },
    zellewalletaddress: {
        type: String
    },
    etheriumwalletaddress: {
        type: String
    },
    cashappwalletaddress: {
        type: String
    },
    gcashname: {
        type: String
    },
    gcashphonenumber: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    name: {
        type: String
    },

})


const depositSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
   
    status: {
        type: String
    },
    depositId: {
        type: String
    },
    amount: {
        type: String
    },
    type: {
        type: String
    },
    date: {
        type: String
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
})

const TradeSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    tradeId: {
        type: String
    },
    date: {
        type: String
    },
    pair: {
        type: String
    },
    profit: {
        type: String
    },
    loss: {
        type: String
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
})

const withdrawSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    status: {
        type: String
    },
    bitcoin_address: {
        type: String
    },
    zelle_address: {
        type: String
    },
    etherium_address: {
        type: String
    },
    cashapp_address: {
        type: String
    },
    withdrawId: {
        type: String
    },
    amount: {
        type: String
    },
    method: {
        type: String
    },
    date: {
        type: String
    },
    swift: {
        type: String
    },
    bank_name: {
        type: String
    },
    account_number: {
        type: String
    },
    account_name: {
        type: String
    },
    phone: {
        type: String
    },
    name:{
        type: String
    },

    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
})



let Trade = new mongoose.model("Trade", TradeSchema)
let User = new mongoose.model("User", userSchema)
let Admin = new mongoose.model("Admin", adminSchema)
let Deposit = new mongoose.model("Deposit", depositSchema)
let Withdraw = new mongoose.model("Withdraw", withdrawSchema)


module.exports.Withdraw = Withdraw
module.exports.Trade = Trade
module.exports.Deposit = Deposit
module.exports.User = User
module.exports.Admin = Admin