const winston = require('winston');

const puppeteerLogger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  defaultMeta: { service: 'puppeteer' },
  transports: [
    new winston.transports.Console(),
  ],
});

export default puppeteerLogger;
