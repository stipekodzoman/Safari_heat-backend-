import jwt from 'jsonwebtoken'

export const verifyToken = (req, res) => {
   const {username,token} = req.query
   console.log(username,token)
   if (!token) {
      
      return res.status(401).json({ success: false, message: "You are not authorize!" })
   }

   // if token is exist then verify the token
   jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      console.log(user)
      if (err) {
         return res.status(401).json({ success: false, message: "Token is invalid" })
      }
      else if(username==user.id){
         return res.status(200).json({success:true})
      }else{
         return res.status(400).json({success:false})
      }
   })
}


export const verifyUser = (req, res, next) => {
   const {id}=req.query
   verifyToken(req, res, next, () => {
      if ((":"+req.user.id) === req.query.id || req.user.role === 'admin') {
         next()
      } else {
         return res.status(401).json({ success: false, message: "You are not authenticated" })
      }
   })
}


export const verifyAdmin = (req, res, next) => {
   verifyToken(req, res, next, () => {
      if (req.user.role === 'admin') {
         next()
      } else {
         return res.status(401).json({ success: false, message: "You are not authorize" })
      }
   })
} 