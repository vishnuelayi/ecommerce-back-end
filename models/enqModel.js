import mongoose from "mongoose";

const EnquirySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true

    },
    email:{
        type:String,
        requird:true
    },
    phone:{
        type:Number,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"Submitted",
        enum:["Submitted","Contacted","Resolved"]
    }
})

const Enquiry = mongoose.model("Enquiry", EnquirySchema);
export default Enquiry;