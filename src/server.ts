import * as dotenv from 'dotenv';
dotenv.config();
import app from './app';
import connect from './database/mongodb';
import { logger } from './lib/logger';
const { PORT } = process.env;

connect(() => {
    app.listen(PORT, () => {
        logger.info(`Server started on port ${PORT}`);
    });
});
