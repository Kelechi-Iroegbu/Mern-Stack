import mongoose from "mongoose";


const connectDB = async ()=>{
    try{
        // mongoose.connection.on('Connected');
    await mongoose.connect(`${process.env.MONGODB_URI}/MERN-AUTH`);
        console.log("database connected")
    }catch (error){
        console.log(error)

    }
                                                                   
}

export default connectDB;