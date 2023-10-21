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
    proofUrl: {
        type: String,
    },
    passportUrl: {
        type: String,
    },
    idCardUrl: {
        type: String,
    },
    tradeProgress: {
        type: Number,
        default:0
    },
    currentPlan: {
        type: String,
        default:'starter'
    },
    availableBalance: {
        type: Number,
        default:0
    },
    profit: {
        type: Number,
        default:0
    },
    deposited: {
        type: Number,
        default:0
    },
    accountType:{
        type:String,
        default:'Live trading account'
    },
    accountStatus:{
        type:String,
        default:'inactive'
    },
    kycVerified:{
        type:Boolean,
        default:false
    },
})


//defining the admin 
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
    phoneNumber:{
        type: String
    },
    name: {
        type: String
    },
    
})

const transactionSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    medium: {
        type: String,
    },
    amount: {
        type: String,
    },
    from: {
        type: String,

    },
    to: {
        type: String,
    },
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
})


let User = new mongoose.model("user", userSchema)
let Admin = new mongoose.model("admin", adminSchema)
const Trasaction = new mongoose.model('transaction',transactionSchema)


module.exports.User = User
module.exports.Admin = Admin
module.exports.Transaction = Trasaction