import cors from 'cors';
import dotenv from 'dotenv';
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import 'reflect-metadata';
import { ValidationError } from 'yup';
import { HttpError } from './common/errors/http.error';
import './containers';
import { routes } from './routes';

class App {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
    }

    private config(): void {
        dotenv.config();

        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(routes);
        this.app.use(this.errorHandling);
    }

    private errorHandling(
        error: Error | HttpError,
        req: Request,
        res: Response,
        _next: NextFunction,
    ) {
        const { code, message, errors } = <any>error;

        const apiError = {
            code:
                <any>error instanceof HttpError ||
                <any>error instanceof ValidationError
                    ? code
                    : 500,
            message,
            errors,
        };

        if (<any>error instanceof ValidationError && !code) {
            apiError.code = 400;
        }

        return res.status(apiError.code || 500).send(apiError);
    }
}

export default new App().app;
