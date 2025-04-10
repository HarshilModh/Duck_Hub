import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
    try {      
        await mongoose.connect(`${process.env.MONGODB_URI}/duck_Hub`);
        console.log(`Connected to MongoDB duck_Hub database`);
    } catch (error) {
        console.log('Error connecting to MongoDB', error);
        process.exit(1);
    }
};
