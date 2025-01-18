import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class IdentifyMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const COOKIE_NAME = 'clientId';

        // Check if the clientId cookie exists
        if (!req.cookies[COOKIE_NAME]) {
            // Generate a new unique identifier
            const clientId = uuidv4();

            // Set the cookie with a 1-year expiration
            res.cookie(COOKIE_NAME, clientId, {
                httpOnly: true,    // Prevent access via JavaScript
                secure: false,     // Set to `true` if using HTTPS
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
                sameSite: 'strict' // Prevent cross-origin access
            });

            console.log(`Generated new clientId: ${clientId}`);
        } else {
            console.log(`Existing clientId: ${req.cookies[COOKIE_NAME]}`);
        }

        next();
    }
}
