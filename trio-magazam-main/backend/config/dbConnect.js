import mongoose from "mongoose";

export const connectDatabase = () => {
    let DB_URI = ""

    if(process.env.NODE_ENV === "DEVELOPMENT") DB_URI = process.env.LOCAL_URI
    if(process.env.NODE_ENV === "PRODUCTION")  DB_URI = process.env.DB_URI

    mongoose.connect(DB_URI).then((con)=>{
        console.log(`Mongo DB elaqesi quruldu ${con ?.connection?.host}`)
    }).catch(xeta => console.log("Bazaya baglanmadi" + xeta))
}
