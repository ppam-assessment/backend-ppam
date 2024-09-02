export abstract class ClientError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }

    public toResponse() {
        return {
            statusCode: this.statusCode,
            message: this.message,
        };
    }
}
