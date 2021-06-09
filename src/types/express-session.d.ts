export {};

declare module "express-session" {
    interface Session {
        user?: User;
    }
}
