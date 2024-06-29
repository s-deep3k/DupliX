import mongoose from "mongoose"
import chalk from "chalk";

export const connectMongoDB = async()=>{
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)
        //connect.connection.host
        console.log(chalk.bgGreenBright(`DB connected `));
    } catch (error) {
        console.log(chalk.bgRed(`Connection to DB disrupted. ${error.message}`));
    }
}