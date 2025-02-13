import { App } from '@/app';
import { initializeOpenAI } from './utils/initializeOpenAI';
import { SubmissionRoute } from './routes/submission.route';
import { ValidationRoute } from './routes/validation.route';

export const openAIHelper = initializeOpenAI();

const app = new App([new SubmissionRoute(), new ValidationRoute()]);

app.listen();