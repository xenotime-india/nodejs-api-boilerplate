import sendgridMailer from 'sendgrid-mailer';
import config from 'config';

const mailer = sendgridMailer.config(config.SENDGRID_API_KEY);

const sendVerifyMail = (toAddress, token) => {
  const textLink = 'http://'+config.HOST+':'+ config.PORT+'/'+config.VERIFY_EMAIL_URL+'/'+token;
  const email = {
    to: toAddress,
    from: config.FROM_EMAIL_ADDRESS,
    subject: 'Account Verification',
    html: `<p>Thanks for Registering</p><p>Please verify your email by clicking on the verification link below.<br/><a href=${textLink.toString()}
    >Verification Link</a></p>`,
  };
  mailer.send(email);
};

export default {
  sendVerifyMail,
};
