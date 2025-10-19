require("dotenv").config()

exports.config = {
    userDb:process.env.USER_DB,
    passDb:process.env.PASS_DB,
    port:process.env.PORT,
}