export const otpHTML = (OTP) => {
  return `<!DOCTYPE html>
 <html lang="en" >
 <head>
   <meta charset="UTF-8">
   <title>Verification OTP</title>
 </head>
 <body>
 <!-- partial:index.partial.html -->
 <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
   <div style="margin:50px auto;width:70%;padding:20px 0">
     <div style="border-bottom:1px solid #eee">
       <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">WEBaniX Solutions</a>
     </div>
     <p style="font-size:1.1em">Hi,</p>
     <p>Do not share Your OTP with anyone.If you havent requested it Contact Us. OTP is valid for 2 minutes</p>
     <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
   </div>
 </div>
 <!-- partial -->
   
 </body>
 </html>`;
};
