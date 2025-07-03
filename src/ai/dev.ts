import { config } from 'dotenv';
config();

import '@/ai/flows/generate-sms-notification.ts';
import '@/ai/flows/find-facilities.ts';
import '@/ai/flows/check-eligibility.ts';
import '@/ai/flows/generate-next-of-kin-sms.ts';
import '@/ai/flows/suggest-redemption-time.ts';
import '@/ai/flows/send-broadcast-sms.ts';
