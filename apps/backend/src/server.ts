import { App } from './app';
import { initializeOpenAI } from './utils/initializeOpenAI';
import { SubmissionRoute } from './routes/submission.route';

export const openAIHelper = initializeOpenAI();

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

try {
  console.log('Starting server...');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Current working directory:', process.cwd());
  
  const app = new App([new SubmissionRoute()]);
  app.listen();
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}
