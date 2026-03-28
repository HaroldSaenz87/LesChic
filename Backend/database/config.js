import mongoose from 'mongoose';

export const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.DB_CNN, {
        })
        console.log('DB Connected');
    } catch (error) {
        console.log(error);
        throw new Error('Cannot connect to DB')
    }
}
