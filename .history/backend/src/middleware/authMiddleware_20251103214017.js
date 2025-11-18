import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();


export default async function (req,res,next){
const header = req.headers['authorization'];
if (!header) return res.status(401).json({ message: 'No token' });
const token = header.split(' ')[1];
try{
const payload = jwt.verify(token, process.env.JWT_SECRET);
const user = await User.findByPk(payload.id);
if (!user) return res.status(401).json({ message: 'Invalid token' });
req.user = user; next();
}catch(err){ return res.status(401).json({ message: 'Invalid token' }); }
}