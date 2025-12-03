import catchAsyncErrors from "./catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
import User from "../model/User.js";

export const isAuthenticatedUser = catchAsyncErrors(async(req , res , next) => {

    const token = req?.cookies?.token
    

    try {

        const decoded =  jwt.verify(token , process.env.JWT_SECRET_KEY)
        console.log(decoded)

        req.user = await User.findById(decoded.id)
        next()
    }

    catch(err) {
        return next(new ErrorHandler("Girish etmelisen" , 401))
    }


  
})

//["admin" , "moderator" , "user"]


export const authorizeRoles = (...roles) => {
return (req , res , next ) => {
    if(!roles.includes(req.user.role)) {
    return next(new ErrorHandler(`Senin rolun ${req.user.role} ve senin bu resurslara girish icazen yoxdur!` , 403))
    }

    next()

}
}


