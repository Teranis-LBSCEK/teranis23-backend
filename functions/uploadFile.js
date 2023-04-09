const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

async function uploadFiles(files) {
    const locations = [];
    const promises = files.map(async (file) => {
      const params = {
        Bucket: "laxmi-signs",
        Key: `${file.originalname}`,
        Body: file.buffer,
      };
  
      const result = await s3.upload(params).promise();
      //console.log(`File uploaded to ${result.Location}`);
      locations.push(result.Location);
    });
  
    await Promise.all(promises);
    //console.log('All files uploaded successfully');
    return locations[0];
};

module.exports = uploadFiles;