import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


//Node Js 18ci versiyadan sonra crypto ozunde saxlayir
import crypto from "crypto"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Adinizi daxil edin"],
        maxLength: [50, "Adiniz max 50 simvoldan ibaret olmalidir "]
    },
    email: {
        type: String,
        required: [true, "E-mail daxil edin"],
        unique: true //unikaldir , email hecvaxt tekrarlana bilmez 

    },
    password: {
        type: String,
        required: [true, "Shifrenizi daxil edin"],
        select: false, //Shifrenin goturulmeyin qarsisin alir
        // Bodyden sifreni ceke bilmemek ucun selecte:false yazirig
        minLength: [8, "Shifrenin minimum uzunlugu 8 simvol olmalidir"]

    },

    avatar: {
        public_id: String,
        url: String,

    },

    role: {
        type: String,
        default: "user" //sayta giren adama user yetkisi veririlir

    },

    resetPasswordToken: String, //shifrenin sifirlanmasi , token link sonunda neponyatni stringlerdir , token bizim melumatlarimiz saxlanilir
    resetPasswordExpire: Date  // shifre deyisimin bitme muddeti 
}, {
    timestamps:true  // Istifadecinin yaratdigi zamaani bazada yerlesmesi , bunu mongo DBde gormusuk
}

)

// JWT Json Web Token 

//this


userSchema.pre("save" , async function(next) {
if(!this.isModified("password")) {
    next()
} 
this.password = await bcrypt.hash(this.password , 10)
} )

userSchema.methods.jwtTokeniEldeEt = function () {
    return jwt.sign({
        id: this._id ,
        
    } , process.env.JWT_SECRET_KEY , {
    expiresIn: String(process.env.JWT_EXPIRES_TIME)
    })
}

userSchema.methods.shifreleriMuqayiseEt = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword , this.password)
}
// 8080 80 http port     443 https port  interview suali
// Azure istifade ederek free olan bir MFA (Multi Factor Authentication) alqoritmini mene yaz
userSchema.methods.getResetPasswordToken = function() {
const resetToken = crypto.randomBytes(20).toString("hex")


this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
this.resetPasswordExpire = Date.now() + 30*60*1000

return resetToken
//a10212131314cf474
//randomBytes , hex ve toString melumat ver
// call apply bind metodunu arashdir
// hex 16lig sistem
}
//20 yazanda 20 simvollu token verir , 10 defe kruq eliyir yeni duzlayir
//this arrow function oz lexical enviroimenti olmur 


//option sozu harda gorduk {} fiqurlu moterize acirirq 


// Yuxaridaki kodun alternativin axtar
//PROTOTYPE Nedir? Neye gore Javascript prototype tipli proqramlasdirm dilidir , Array.prototype.map()



export default mongoose.model("User", userSchema)




// Single Sign On SSO