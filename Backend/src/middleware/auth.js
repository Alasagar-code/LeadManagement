const jwt = require("jsonwebtoken");
const users = require("../models/user");
require("dotenv").config();

const userauth = async(req,res,next)=>{
    try{
        const token = req.cookies?.token;
        if(!token) return res.status(401).json({message:"Not authorized"});

        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await users.findById(decoded.id).select("-password");
        if(!user) return res.status(401).json({
            message:"user not found",
        })
        req.user=user;
        next();
    }
    catch(error){
        return res.status(401).json({
            message:"not authorized",
            error:error.message
        })
    }
}

module.exports=userauth;
