declare const _default: () => {
    port: number;
    mongodbUri: string | undefined;
    jwt: {
        secret: string | undefined;
        expiresIn: string;
        refreshSecret: string | undefined;
        refreshExpiresIn: string;
    };
};
export default _default;
