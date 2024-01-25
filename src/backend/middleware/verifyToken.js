// import npm packages
import jwt from "jsonwebtoken";

const verifyToken = (req) => {
  let authenticated = false;

  const auth = req?.headers?.authorization?.split(" ");
  const cookies = req?.cookies?.get("accessToken")?.value;

  const token = (auth && auth[1]) || cookies;
  const privateKey = process.env.ACCESS_TOKEN;

  if (token) {
    jwt.verify(token, privateKey, (err, decoded) => {
      if (err) return;

      if (decoded.role === "admin") authenticated = true;
    });
  }

  return authenticated;
};

export default verifyToken;
