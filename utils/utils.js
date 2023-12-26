const jwt = require("jsonwebtoken")
require("dotenv").config()
const { Admin } = require("../database/databaseConfig")

const secret = process.env.SECRET_KEY



module.exports.generateAcessToken = (email) => {
    let token = jwt.sign({ email: email }, 'littlesecret', { expiresIn: "5000h" })
    return token
}


module.exports.verifyAdmin = async (req, res, next) => {
    try {
        console.log('verifying admin')
        let token = req.headers["header"]

        if (!token) {
            throw new Error("a token is needed")
        }
        const decodedToken = jwt.verify(token, 'littlesecret')
        let admin = await Admin.findOne({ email: decodedToken.email })

        console.log(admin)
        
        req.user = admin
        next()
    } catch (err) {
        console.log(err)
        let error = new Error("not authorize")
        error.statusCode = 301
        error.message = err.message
        return next(error)
    }
}







module.exports.welcomeTemplate = (name) => {
    return `
<div >
    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">----------------------</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">WELCOME <h2>

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem"> ${name}! to stockexchagecryptomanagement.com.<br><br>
    
    We are happy to welcome you to stockexchagecryptomanagement trading community.This is just the beginning of greater things to come 
    
    <br><br>
    Make a deposit, buy an investment plan and sit back to enjoy as we make you money work for you!
    
    <br><br>
    <strong>We look foward to seeing you gain your financial freedom</strong> </p>

    
    <h2 style=" margin-bottom: 30px; width: 100%; text-align:center; font-weight: 400 ">Happy trading !!</h2>


</div>`

}







module.exports.fundTemplate = ( currency, amount) => {
    return `
<div >
    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">----------------------</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">CREDIT </h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">-------------------------</h2>

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">Your account has just been credited with the sum of  ${currency}${amount}.</p>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align:center; font-weight: 400 ">Happy trading !!</h2>


</div>`

}
module.exports.withdrawTemplate = ( currency, amount) => {
    return `
<div >
    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">----------------------</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">Withdraw </h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">-------------------------</h2>

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">Your request to make a withdrawal of ${currency}${amount} has been recieved. Transaction will be processed shortly! you can chat us via our live chat support if it persist for further detailed instruction</p>


    <h2 style=" margin-bottom: 30px; width: 100%; text-align:center; font-weight: 400 ">Happy trading !!</h2>


</div>`

}
