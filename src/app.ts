import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { routes } from './routes';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

const app = express();

app.use(helmet());
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;