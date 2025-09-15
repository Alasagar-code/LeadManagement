const jwt = require("jsonwebtoken");
const users = require("../models/user");
require("dotenv").config();

const createtoken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:"7d",
    });
}

const cookieoptions = ()=>{
    return {
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:process.env.NODE_ENV==="production"?"none":"lax",
        maxAge:7*24*60*60*1000
    };
}

const register = async(req,res)=>{
    try{
        const {name,email,password} = req.body;
        if(!name || !email || !password) return res.status(400).json({
            message:"All fields are required"
        })
        const exist = await users.findOne({email});
        if(exist) return res.status(400).json({
            message:"Email already existed"
        })
        const user = await users.create({name,email,password});
        const token = createtoken(user._id);
        res.cookie("token",token,cookieoptions());
        res.status(201).json({id:user._id,name:user.name,email:user.email})

    }
    catch(error)
    {
        res.status(400).json({
            message:"server error",
            error:error.message
        })
    }
}

const login  = async(req,res)=>{
    try{
        const {email,password} = req.body;
        if(!email || !password) return res.status(400).json({message:"Email and password required"});
        const user = await users.findOne({email}).select("+password");
        if (!user || !(await user.matchpassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const token = createtoken(user._id);
        res.cookie("token",token,cookieoptions());
        res.status(200).json({id:user._id,name:user.name,email:user.email,token});
    }
    catch(error)
    {
        return res.status(400).json({
            message:"server error",
            error:error.message,
        });
    }
};

const logout = (req,res)=>{
    res.clearCookie("token",cookieoptions());
    res.status(200).json({message:"Logged out"});
};

const me = (req,res)=>{
    res.status(200).json(req.user);
}

module.exports={
    register,
    login,
    logout,
    me
}
