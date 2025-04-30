import userModel from "../Models/userModel.js";


export const getUserData = async (req,res)=>{
    try {
        const {userId} = req.body;
        const user = await userModel.findById(userId);
        
        if(!user){
            return({success:false,
                message:'User not found'
            });
        }else{
        res.json({
            success:true,
            userData:{
                name:user.name,
                isAccountverified:user.isAccountverified
            }
        })}

    } catch (error) {
        res.json({success:false,
            message:error.message
        })
        
    }

}