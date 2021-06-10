import { hasKeys } from "../utils";

export interface Message {
    username: string;
    message: string;
    timestamp: number;
}

export function isMessage(msg: any): msg is Message {
    return hasKeys(msg, ["username", "message", "timestamp"]);
}
