'use server';

import AfricasTalking from 'africastalking';

const africastalking = AfricasTalking({
  apiKey: process.env.AT_API_KEY!,
  username: process.env.AT_USERNAME!,
});

const sms = africastalking.SMS;

export async function sendSms(to: string, message: string) {
  try {
    const result = await sms.send({
      to,
      message,
      from: 'HeroDrop'
    });
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}