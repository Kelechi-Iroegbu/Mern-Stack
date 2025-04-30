import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from '../Models/userModel.js'
import transporter from '../config/nodemailer.js'
import { EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE } from '../config/email_Template.js'

export const register = async (req,res)=>{
    const {name,email,password} = req.body;
    if(!name || !email || !password){
        return res.json({
            success:false,
            message:'Missing Details'
        })
    }
    try {
        const existingUserEmail = await userModel.findOne({email})
        if(existingUserEmail){
            return res.json({
                success:false,
                message : "User already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password,8);
        const user = new userModel({name, email, password:hashedPassword});
        await user.save();
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV ==='Production',
            sameSite:process.env.NODE_ENV ==='Production' ?
            'none':'strict',
            maxAge :  7 * 24 * 60 *60 * 1000
        })

        const mailOptions = {
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:'Welcome to SaneTravels',
            text:`Welcome to SaneTravels our website is on the ways....Your account has an email id:${email}`
        }
        await transporter.sendMail(mailOptions);
    
        return res.json({
            success:true,
            message:'Successful Register'
        });
        
    } catch (error) {
        console.log(error)
        res.json({
            success:false,
            message:error.message
        })
        
        
    }
}
export const login = async (req,res)=> {
    const { email, password} = req.body;
    if(!email || !password){
        return res.json({
            success:false,
            message:'Email and Password',
        });
    }
    try {
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:'Invalid Email'})
        }
        const ismatch = await bcrypt.compare(password,user.password)
        if(!ismatch){
            return res.json({success:false,message:'Invalid Password'})
        }
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV ==='Production',
            sameSite:process.env.NODE_ENV ==='Production' ?
            'none':'strict',
            maxAge :  7 * 24 * 60 *60 * 1000
        });
        return res.json({
            success:true,
            message:'Successful Login'
        });
        
    } catch (error) {
        return res.json({success:false,
            message:error.message
        })
    }

    }
export const logout = async(req,res)=>{
    try {
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV ==='Production',
            sameSite:process.env.NODE_ENV ==='Production' ?
            'none':'strict',
            
    })
    return res.json({
        success:true,
        message:'Logged Out'
    })

    } catch (error) {
        res.json({success:false,
            message:error.message
        })
    }
}

export const sendVerifyOtp = async (req,res)=>{
    try {
        const {userId} = req.body;
        const user = await userModel.findById(userId)
        console.log(user,userId)
        
        if (user.isAccountVerified){
            return res.json({success:false,
                message:"Account already verified"
            });
        }
        
            const otp = String(Math.floor(100000 + Math.random()*900000));

user.verifyOtp=otp;
user.verifyOtpExpireAt=Date.now() + 24 * 60 *60 * 1000
await user.save();

const mailOption = {
    from:process.env.SENDER_EMAIL,
    to:user.email,
    subject:'Account verification OTP',
    text:`Your OTP is ${otp}. Verify your account using this OTP `,

}
await transporter.sendMail(mailOption);
return res.json({success:true,message:'Verification OTP sent on Email'});


    } catch (error) {
        console.log(error)
        return res.json({success:false,message:error.message});
        
    }
}

export const verifyEmail = async(req,res)=>{
    const {userId,otp} = req.body;

    if(!userId || !otp){
        return res.json({success:false, message:'Missing details'})

    }
    try {
        const user = await userModel.findById(userId);
        if (!user){
            return res.json({sucess:false, message: 'User not found'})
        }

        if(user.verifyOtp ==='' || user.verifyOtp !==otp){
            return res.json({success:false,message:'Invalid OTP'});

        }
        if (user.verifyOtpExpireAt < Date.now()){
            res.json({success:false,message:'OTP Expired'});
        }
        
        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpireAt=0 ;

        await user.save()
        return res.json({success:true,
            message:"Email verified Successful"
        })


        
    } catch (error) {
        return res.json({success:false, message:'error.message'});
        
    }
}

export const isAuthenticated = async (req,res)=>{

    try {
        res.json({success:true,})
    } catch (error) {
        res.json({success:false,
            message:error.message})
    }

}

export const sendResetOtp = async (req,res)=> {
    const{email} = req.body;
    if(!email){
        return res.json({success:false,message:'Email is Required'})
    }
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({sucess:false,
                message:'User not found'
            });
        }
        const otp = String(Math.floor(Math.random()*9000000));

user.resetOtp=otp;
user.resetOtpExpiredAt=Date.now() + 15 *60 * 1000
await user.save();

const mailOption = {
    from:process.env.SENDER_EMAIL,
    to:user.email,
    subject:'Password Reset Otp', 
    text:`Your otp for Password os ${otp}`,
    html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)

}
await transporter.sendMail(mailOption);
return res.json({
    success:true,
    message:'Otp sent to your email'
})

        
    } catch (error) {
        res.json({
            success:false,
            message:error.message
        });
        
    }
}
export const resetPassword = async (req,res)=>{
    const{email,otp,newPassword} = req.body;
    if(!email || !otp ||!newPassword){
        return res.json({
            success:false,
            message:'Email,Otp,and new password are required'
        });
    }
    try {
        const user =await userModel.findOne({email});
        if(!user){
            return res.json({success:false,
                message:'User not found'
            })
        }
        if(user.resetOtp === ""|| user.resetOtp !==otp){
            res.json({
              success:false,
              message:'Invalid OTP'  
            })
        }

        if(user.resetOtpExpiredAt < Date.now()){
            return res.json({success:false,
                message:'OTP Expired'
            });
        }
        const hashedPassword = await bcrypt.hash(newPassword,10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpiredAt = 0;

        await user.save();
        return res.json({
            success:true,
            message:'Password has been reset'
        });

        
        
    } catch (error) {
        return res.json({
            success:false,
            message:error.message 
        })
        
    }

}
