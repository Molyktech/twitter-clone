import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("token", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true, // prevent xss attacks
    sameSite: "strict", // CSRF attacks prevention
    secure: process.env.NODE_ENV === "production" ? true : false, // cookie only works in https in production
  });
};
