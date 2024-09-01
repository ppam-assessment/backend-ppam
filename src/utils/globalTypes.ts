declare global {
    interface TokenPayload {
        id: string;
        username: string;
        type: string,
        exp: number;
    }
}