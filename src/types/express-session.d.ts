import { User } from "../store/userStore";

export {};

declare module "express-session" {
    interface Session {
        user?: User;
    }
}
