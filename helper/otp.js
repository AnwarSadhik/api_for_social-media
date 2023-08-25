import axios from "axios";

const sendSMS = async (phone, otp) => {
    try {
      let cnt = phone.substring(0,3);
      let phn = phone.substring(3)

      const sms = await axios.get(
        `https://api.authkey.io/request?authkey=${process.env.AUTH_KEY}&mobile=${phn}&country_code=${cnt}&sid=6737&name=UPONE&otp=${otp}`
      );

    } catch (error) {
      console.log(error);
    }
  };

const generateOTP = (otp_length) => {
    var OTP = "";
    var digits = "0123456789";
    for (let i = 0; i < otp_length; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  };

export { sendSMS,generateOTP }