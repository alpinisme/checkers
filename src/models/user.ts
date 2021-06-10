import { hasKeys } from "../utils";

export interface User {
    username: string;
    wins: number;
    losses: number;
}

export function isUser(user: any): user is User {
    return hasKeys(user, ["username", "wins", "losses"]);
}
