const jwt = require('jsonwebtoken')
function admin(req,res,next){
    let token = req.header('authorization');
     if(!token)  res.status(483).send("Unauthorized..");
    token=token.split(" ")[1];
  
   try {
      let decodedData = jwt.verify(token, "cashie-key");
   if(decodedData.role !== "admin") res.status(401).send('Access denied...');
   next();
    } catch (error) {
       res.status(483).send("Unauthorized..");
   }

  
}
module.exports = admin;