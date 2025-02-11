import { App } from '@/app';
import { initializeOpenAI } from '@/utils/initializeOpenAI';
import { SubmissionRoute } from '@/routes/submission.route';

export const openAIHelper = initializeOpenAI();

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  console.error(error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
});

try {
  console.log('Starting server with environment:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    CWD: process.cwd(),
    FILES: require('fs').readdirSync('.')
  });

  const app = new App([new SubmissionRoute()]);
  app.listen();
} catch (error) {
  console.error('Fatal error during server startup:', error);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}
