// improt some npm packages
import { jwtVerify } from "jose";

// verifyToken code define here : Using jose npm package
export default async function verifyTokenJose(req) {
  // set authorised value to false
  let authorised = false;

  // encode the secrect key to TextEncoder due to jose packages
  const secret = new TextEncoder().encode(process.env.SECRECT_KEY);

  // get the auth and cookies
  const auth = req?.headers?.authorization?.split(" ");
  const cookies =
    req?.cookies?.get("accessToken")?.value || req.headers.cookies?.accessToken;

  // get the token from auth or cookies
  const token = (auth && auth[1]) || cookies;

  try {
    // verify the token and decode it
    const { payload } = await jwtVerify(token, secret);

    // storing the userId into the req for further use
    req.userId = payload.userId;

    // if the token is valid then is set the value of authorised to true
    authorised = true;
  } catch (err) {
    // else set the value of authorised to false
    return authorised;
  }

  return authorised;
}
