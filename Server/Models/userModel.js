import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    password:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    verifyOtp:{type:String,default:''},
    verifyOtpExpiredAt:{type:Number,default:'0'},
    isAccountVerifed:{type:Boolean,default:false},
    resetOtp:{type:String,default:''},
    resetOtpExpiredAt:{type:Number, default: 0},
})

const userModel = mongoose.models.client || mongoose.model('client',userSchema)
export default userModel;