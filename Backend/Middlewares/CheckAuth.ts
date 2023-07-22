import jwt from 'jsonwebtoken';
import prisma from './prisma-client.js';

const CheckAuth=async(req,res,next)=>{
    let token;

    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    )
}