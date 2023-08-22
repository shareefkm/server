import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_LOCAL_URL)
        console.log(`MongoDB connected ${mongoose.connection.host}`);
    } catch (error) {
        console.log(`MongoDb connection error ${error}`);
    }
}
export default connectDB;