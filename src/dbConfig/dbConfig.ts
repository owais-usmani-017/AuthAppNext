import mongoose from "mongoose";

export async function connectDb(){
    try{
        mongoose.connect(process.env.MONGO_URL!)
        const connection = mongoose.connection;

        connection.on('connected' , ()=>{
            console.log('mongoDB connected successfully');
        })

        connection.on('error' , (err)=>{
            console.log('Error connecting to mongoDB. Please make sure mongodb is running '+ err);
            process.exit();
        })

    }catch(err){
        console.log("Error connecting to database", err);
        console.log(err);
    }
}