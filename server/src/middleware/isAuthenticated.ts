import express from "express";
import jwt from "jsonwebtoken";

/* Handle jwt check for protected routes */
export const isAuthenticated = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    const { authorization } = req.headers;

    if (!authorization) {
        res.status(403).json({ message: "Forbidden" });
        return;
    }

    try {
        const token = authorization.split(" ")[1];
        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
        req.payload = payload;
    } catch (err) {
        if (err instanceof Error && err.name === "TokenExpiredError") {
            res.status(401).json({ message: "Unauthorized: " + err.name });
            return;
        }
        res.status(403).json({ message: "Forbidden" });
        return;
    }

    return next();
};
