import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const Authenticate = async (req,res,next)=>{
    try{
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        // console.log("auth user",token);
        if(!token){
            return res.status(401).send({status:false,message:"Unauthorized request"});
        }
        
        const decodedToken = await jwt.verify(token,process.env.ACCESS_TOKEN_KEY);

        const user = await userModel.findById(decodedToken?._id).select("-password");

        if(!user){
            return res.status(400).send({status:false,message:"Invalid Access Token"});
        }

    //    console.log("auth user",user);

        req.user = user;
        next();
    }catch(err){
        return res.status(500).send({status:false,message:err.message});
    }
}

export default Authenticate;