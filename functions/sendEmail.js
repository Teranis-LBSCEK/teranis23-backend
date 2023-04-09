const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.SES_REGION,
});
const ses = new AWS.SES({ apiVersion: "2022-05-17" });

module.exports.sendEmail = async (to, text, subject, html) => {
    let htmlbody
    if(html){
      htmlbody = html
    }
    else{
      htmlbody = `<p>${text}<p>`
    }
    const params = {
        Destination: {
          ToAddresses: to, // Email address/addresses that you want to send your email
        },
        Message: {
          Body: {
            Text: {
              Charset: "UTF-8",
              Data: text,
            },
          Html: {
            Charset: "UTF-8",
            Data: htmlbody,
          }
          },
          Subject: {
            Charset: "UTF-8",
            Data: subject,
          },
        },
    
        Source: process.env.SES_SOURCE,
    };
    
    const sendEmailReceiver = ses.sendEmail(params).promise();
    
    sendEmailReceiver.then((data) => {
        console.log("Email submitted to SES", data);
    }).catch((error) => {
        console.log(error);
    });
  }