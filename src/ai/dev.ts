import { config } from 'dotenv';
config();

import '@/ai/flows/generate-sms-notification.ts';
import '@/ai/flows/find-facilities.ts';
import '@/ai/flows/check-eligibility.ts';
