import nodemailer from "nodemailer";



// SMTP Send Mail Transfer Protocol
// POP3 Elektron poct qebul olunmasi protokolu


export const sendEmail = async (options) => {
// Looking to send emails in production? Check out our Email API/SMTP product!
const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  }
});



  const message = {
    from: `${process.env.SMTP_FROM_EMAIL} <${process.env.SMTP_FROM_NAME}>` ,
    to: options.email   ,
    subject: options.subject , 
    html: options.message 

  }

  await transport.sendMail(message)
}