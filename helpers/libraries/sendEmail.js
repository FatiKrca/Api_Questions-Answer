const nodemailer = require("nodemailer");

const sendEmail = async(mailOptions)=>{
    console.log("1")
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
      //  service: process.env.SMTP_SERVICE,
        port: process.env.SMTP_PORT,
      //  secureConnection: false,

      
        auth:{
            user: process.env.SMTP_USER,
            pass:process.env.SMTP_PASS
        }
        //,
        // tls: {
        //     ciphers:'SSLv3'
        // }
    });

    let info = await transporter.sendMail(mailOptions);

    console.log(`message sent: ${info.messageId}`)

}
module.exports=sendEmail