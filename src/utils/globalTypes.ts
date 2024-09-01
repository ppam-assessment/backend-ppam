declare global {
    interface TokenPayload {
        id: string;
        username: string;
        type: string,
        exp: number;
    }

    enum viewStatus {
        approve,
        reject,
        resubmit
    }
}