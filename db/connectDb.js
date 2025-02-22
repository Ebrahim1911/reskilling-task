import { connect } from "mongoose";

export const connectDb = async () => {
  try {
    const connecion=await connect(process.env.DATABASE_URI);
    console.log(`Connected to MongoDB ${connecion.connection.host}`);
  } catch (error) {
    console.error('err message',error.message);
    process.exit(1);
  }
}