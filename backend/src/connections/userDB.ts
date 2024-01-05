import mongoose from "mongoose";

const connectUserDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "");
    console.log(`Mongo Connect: ${conn.connection.host}`);
  } catch (error: any) {
    console.log(`Mongoose Error: ${error.message}`);
    process.exit(1);
  }
};
export default connectUserDb;
