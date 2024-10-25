import emailjs from '@emailjs/nodejs';

emailjs.init({
  publicKey: 'necFMTmQlUPrfA5ZL',
  privateKey: 'HrqUduLov-p9hUGQzq4zu',
  // Do not allow headless browsers
  blockHeadless: true,
  blockList: {
    // Block the suspended emails
    list: ['foo@emailjs.com', 'bar@emailjs.com'],
    // The variable contains the email address
    watchVariable: 'userEmail',
  },
  limitRate: {
    // Set the limit rate for the application
    id: 'app',
    // Allow 1 request per 
    throttle: 1000
  },
});

const sendAlertEmail = async (email, city, temperature, condition) => {
  // console.log(process.env.EMAILJS_PUB_KEY)
  const mailOptions = {
    // from: process.env.EMAIL_USER,
    to_email: email, // The user's email
    subject: `Weather Alert for ${city}`,
    message: `Alert: The temperature in ${city} has reached ${temperature-273.15}°C with ${condition} conditions.`,
    reply_to: 'rajsah5556@gmail.com'
  }; 
  // console.log(mailOptions)
  emailjs.send('rajsah5556', 'WMS-service', mailOptions).then(
    (response) => {
      console.log('SUCCESS!', response.status, response.text);
    },
    (error) => {
      console.log('FAILED...', error);
    },
  );
};

export default sendAlertEmail