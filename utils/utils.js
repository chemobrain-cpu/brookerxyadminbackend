const jwt = require("jsonwebtoken")
require("dotenv").config()
const { Admin } = require("../database/databaseConfig")


const secret = process.env.SECRET_KEY



module.exports.generateAcessToken = (email) => {
    let token = jwt.sign({ email: email }, secret, { expiresIn: "5000h" })
    return token
}


module.exports.verifyAdmin = async (req, res, next) => {
    try {
        console.log('verifying admin')
        let token = req.headers["header"]

        if (!token) {
            throw new Error("a token is needed")
        }
        const decodedToken = jwt.verify(token, secret)
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