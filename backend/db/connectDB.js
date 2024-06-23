import mongoose from "mongoose";
import { MONGO_URI } from "../../env";
import chalk from "chalk";

export const connectMongoDB = async()=>{
    try {
        const connect = await mongoose.connect(MONGO_URI)
        console.log(chalk.bgGreenBright(`DB connected : ${connect.connection.host}`));
    } catch (error) {
        console.log(chalk.bgRed(`Connection to DB disrupted. ${error.message}`));
    }
}