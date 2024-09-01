declare global {
    interface TokenPayload {
        id: string;
        username: string;
        type: string,
        exp: number;
    }

    interface getAllUsersParams {
        admin: boolean | undefined;
        submitter: boolean | undefined;
        viewer: boolean | undefined;
        blocked: boolean | undefined;
    }
}