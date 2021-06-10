export function replaceItemAtIndex<A>(array: A[], index: number, item: A) {
    if (array[index] == undefined) {
        throw new Error(
            `Cannot replace item at index (${index}), because nothing exists at that index in given array`
        );
    }
    return [...array.slice(0, index), item, ...array.slice(index + 1)];
}

export function parseJson(json: string | null): unknown {
    if (typeof json != "string") {
        throw new TypeError("Failed to parse non-string as json");
    }
    return JSON.parse(json);
}

export function assertType<A>(
    value: unknown,
    guard: (a: unknown) => a is A
): A {
    if (!guard(value)) {
        throw new TypeError(
            "Failed to assert that value passes type guard " + guard.name
        );
    }
    return value;
}

export function hasKeys(obj: Object, keyList: string[]) {
    if (!obj?.hasOwnProperty) {
        return false;
    }
    return keyList.reduce((result, key) => {
        if (result == false) {
            return false;
        }
        return obj.hasOwnProperty(key);
    }, true);
}
