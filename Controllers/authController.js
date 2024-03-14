import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {isTestUser} from "../utils/testuser/isTestUser.js"

// user register
export const register = async (req, res) => {
   try {
      //hashing password
      const isTest=isTestUser(req.body.username)
      if (isTest) {
         return res.status(404).json({success:false,mesage:"This username is for test user. Please try other username"})
      }
      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(req.body.password, salt)

      const newUser = new User({
         username: req.body.username,
         firstname:req.body.firstname,
         lastname:req.body.lastname,
         phonenumber:req.body.phonenumber,
         email:req.body.email,
         country:req.body.country,
         password:hash

      })
      await newUser.save()
      res.status(200).json({ success: true, message: "Successfully created!" })
   } catch (error) {
      console.log(error)
      res.status(500).json({ success: false, message: "That username already exists! Try again." })
   
   }
}

// user login
export const login = async (req, res) => {
   try {
      const {username,password} = req.body
      console.log(username, password)
      const isTest=isTestUser(username)
      if (isTest) {
         if (password != "Aa1234"){
            return res.status(404).json({ success: false, message: 'Incorrect password' })
         }
         const testuser=await User.findOne({username:username})
         if (testuser) {
            return res.status(404).json({ success: false, message:"This account is already in use" })
         }
         else{
            const testUserData = new User({
               username:username,
               balance:10000.00
            })
            await testUserData.save()
            runKafka(username)
            return res.status(200).json({ success: true, message:"Successfully logged in!" })
         }
      }
      else{
         const user=await User.findOne({ username:username })
         // if user doesn't exist
         if (!user) {
            return res.status(404).json({ success: false, message: 'User not found!' })
         }

         // if user is exist then check the password or compare the password
         const checkCorrectPassword = await bcrypt.compare(req.body.password, user.password)

         // if password incorrect 
         if (!checkCorrectPassword) {
            return res.status(401).json({ success: false, message: "Incorrect password!" })
         }
         else{

            // create jwt token
            const token = jwt.sign({ id: user.username, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn:"15d" })

            // set token in the browser cookies and send the response to the client
            res.status(200).json({accessToken:token, message:"Successfully logged in!"})
         }
      }
      
   } catch (error) {
      console.log(error)
      res.status(500).json({ success: false, message: "Failed to login" })
   }
}

export const logout = async(req,res)=>{
   const {username}=req.body
   const isTest= isTestUser(username)
   if (isTest){
      await User.deleteOne({username:username})
      res.status(200).json({status:true,message:"Successfully logged out"})
   }
   else {
      res.status(200).clearCookie("accessToken").json({ success: true, message: 'Successfully logged out' })
   }
}