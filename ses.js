const aws = require('aws-sdk');

let secrets;
if (process.env.NODE_ENV == 'production') {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require('./secrets'); // in dev they are in secrets.json which is listed in .gitignore
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: 'eu-central-1'
});

exports.sendResetMail = (to,code) => {
    return ses.sendEmail({
        Source: 'Happy Gaming <gameslpf0@gmail.com>', 
        Destination: {
            ToAddresses: [to]
        },
        Message: {
            Body: {
                Text: {
                    Data: `Here is your recovery code: ${code}. Please, follow the instructions!`
                }
            },
            Subject: {
                Data: "Reset your password"
            }
        }
    }).promise();
};