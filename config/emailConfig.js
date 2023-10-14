import nodeMailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const configEmail = {
    //send email verification link
sendVerifyMail: async (name, email, user_id) => {
    try {
      const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.USER_MAIL,
          pass: process.env.PASS,
        },
      });
      const mailOptions = {
        from: "Yummi",
        to: email,
        subject: "For verification",
        html: `<p>Hello ${name}, Please click <a href="http://localhost:4000/verify/${user_id}">here</a> to verify your email.</p>`,
      };
      const info = await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error(error.message);
    }
  },
  
  //send forgot password link
  sendForgetPassword: async (name, email, user_id) => {
    try {
      const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.USER_MAIL,
          pass: process.env.PASS,
        },
      });
      const mailOptions = {
        from: "Yummi",
        to: email,
        subject: "For Reset Password",
        html: `<p>Hello ${name}, Please click <a href="http://localhost:4000/resetpassword/${user_id}">here</a> to reset your password.</p>`,
      };
      const info = await transporter.sendMail(mailOptions);
      console.log("forget link email sent:", info.response);
    } catch (error) {
      console.error(error.message);
    }
  }
}