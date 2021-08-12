const jwt = require('jsonwebtoken')
function auth(req,res,next){
    let token = req.header('authorization');
     if(!token)  res.status(483).send("Unauthorized..");
    token=token.split(" ")[1];
  
   try {
      let decodedData = jwt.verify(token, "cashie-key");
   decodedData && next();
    } catch (error) {
       res.status(483).send("Unauthorized..");
   }

  
}
module.exports = auth;