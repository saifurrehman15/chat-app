import jwt from "jsonwebtoken"
export function authenticateUser(req, res, next) {
  const bearerToken = req.headers?.authorization;
console.log(req.user,res.user);

  if (!bearerToken) {
    return res.status(400).json({
      error: true,
      msg: "Token Not Provided",
    });
  }

  const token = bearerToken.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    console.log("Decoded JWT: ", decoded); 
    res.status(200).json({user : decoded});
    next();
  } catch (err) {
    return res.status(401).json({
      error: true,
      msg: "Invalid or expired token",
    });
  }
}
