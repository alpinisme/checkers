export default class ValidationError extends Error {
    field;
    rule;

    constructor(field: string, rule: string) {
        super(`Invalid ${field}: ${rule}`);
        this.name = "ValidationError";
        this.field = field;
        this.rule = rule;
    }
}
