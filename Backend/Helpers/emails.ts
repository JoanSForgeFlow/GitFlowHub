import nodemailer from "nodemailer";
import dotenv from "dotenv";

const signInEmail = async (data) => {
  const { email, username, token } = data;

  //   obtain env variables
  const {
    USER_NODEMAILER,
    PASSWORD_NODEMAILER,
    FRONTEND_URL,
    PORT_NODEMAILER,
    HOST_NODEMAILER,
  } = process.env;
  //nodemailer configuration
  const transport = nodemailer.createTransport({
    host: HOST_NODEMAILER,
    port: PORT_NODEMAILER,
    auth: {
      user: USER_NODEMAILER,
      pass: PASSWORD_NODEMAILER,
    },
  });

  const info = await transport.sendMail({
    from: '"GitFlowHub <account@gitflowhub.com>"',
    to: email,
    subject: "GitFlowHub - Confirm account",
    text: "Confirm your GitFlowHub account ",
    html: `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Confirm Your Account</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                line-height: 1.6;
                color: #24292e;
                background-color: #f6f8fa;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #e1e4e8;
                border-radius: 6px;
                background-color: #ffffff;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
            }
    
            a {
                color: #0366d6;
                text-decoration: none;
            }
    
            a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <p>Hello ${username},</p>
            
            <p>Thank you for signing up for our service! To activate your account, please use the following link:</p>
            
            <a href="${FRONTEND_URL}/confirm-account/${token}">Confirm your account</a>
            
            <p>If you did not create an account, please ignore this email.</p>
            
            <p>Thank you,</p>
            <p>The GitFlowHub Team</p>
        </div>
    </body>
    </html>
`,
  });
};

const newPasswordEmail = async (data) => {
  const { email, username, token } = data;

  //   obtain env variables
  const {
    USER_NODEMAILER,
    PASSWORD_NODEMAILER,
    FRONTEND_URL,
    PORT_NODEMAILER,
    HOST_NODEMAILER,
  } = process.env;
  //nodemailer configuration
  const transport = nodemailer.createTransport({
    host: HOST_NODEMAILER,
    port: PORT_NODEMAILER,
    auth: {
      user: USER_NODEMAILER,
      pass: PASSWORD_NODEMAILER,
    },
  });
  const info = await transport.sendMail({
    from: '"GitFlowHub <account@gitflowhub.com>"',
    to: email,
    subject: "GitFlowHub - Reset your password",
    text: "Reset your GitFlowHub password ",
    html: `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Confirm Your Account</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                line-height: 1.6;
                color: #24292e;
                background-color: #f6f8fa;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #e1e4e8;
                border-radius: 6px;
                background-color: #ffffff;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
            }
    
            a {
                color: #0366d6;
                text-decoration: none;
            }
    
            a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <p>Hello ${username},</p>
            
            <p>Thank you for contacting us! To reset your password, please use the following link:</p>
            
            <a href="${FRONTEND_URL}/forget-password/${token}">Reset your password</a>
            
            <p>If you don't request to reset your password, please ignore this email.</p>
            
            <p>Thank you,</p>
            <p>The GitFlowHub Team</p>
        </div>
    </body>
    </html>
`,
  });
};

export { signInEmail, newPasswordEmail };
