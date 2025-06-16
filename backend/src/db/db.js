import mongoose from "mongoose";

export const connectDB = async ()=>{
    try {
        const dbConnection = await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`);
         console.log(`mongodb connected at port,Host:-${dbConnection.connection.host}`)
    } catch (error) {
        console.log(`mongodb connection faild`,error)
        process.exit(1)
    }
};