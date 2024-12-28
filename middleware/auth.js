import jwt from "jsonwebtoken";
import sendResponse from "../helpers/sendResponse.js";
import "dotenv/config";

export function authenticateUser(req, res, next) {
  const bearerTOken = req.headers?.authorization;
  console.log("bearerTOken=>", bearerTOken);
  if (!bearerTOken)
    return sendResponse(res, 400, null, true, "Token Not Provided");

  const token = bearerTOken.split(" ")[1];

  const decoded = jwt.verify(token, process.env.AUTH_SECRET);

  req.user = decoded;
  console.log("decoded=>", decoded);
  next();
}

