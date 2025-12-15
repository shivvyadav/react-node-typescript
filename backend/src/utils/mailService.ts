import nodemailer from 'nodemailer'; 

//code is for sending verification code
export const sendMail = async (email: string, code?: string): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Your SignUp Verification Code',
      text: `Your verification code is ${code}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email');
  }
};
