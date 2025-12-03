export default (user,statusCode, res) => {
    const token = user.jwtTokeniEldeEt()
console.log(token)
    // options

    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME *24*60*60*1000),
        httpOnly:false
    }


    //COOKIE
    res.status(statusCode).cookie("token", token, options).json({
        token,
        user
    })
}

