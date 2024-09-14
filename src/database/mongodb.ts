import mongoose from "mongoose";

export default function(cb: any){
    mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_ACCESS_KEY}/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
    .then(() => {
        cb();
    })
    .catch(err => console.log(err));
}