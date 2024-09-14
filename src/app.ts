import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

import { logger } from './lib/logger';
import handlers from './lib/handlers';
import routes from './routes';

const app: Express = express();

app.use(compression());
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.set('trust proxy', true);

app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(
        'Incoming request \nmethod %o, \npath %o, \nbody %o, \nparams %o, \nquery %o, \nheaders %o',
        req.method,
        req.originalUrl,
        req.body,
        req.params,
        req.query,
        req.headers
    );
    next();
});
app.use('/api/v1', routes);

app.use(handlers.Error404Handler);

app.use(handlers.errorHandler);

export default app;
