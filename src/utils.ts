export function replaceItemAtIndex<A>(array: A[], index: number, item: A) {
    if (array[index] == undefined) {
        throw new Error(
            `Cannot replace item at index (${index}), because nothing exists at that index in given array`
        );
    }
    return [...array.slice(0, index), item, ...array.slice(index + 1)];
}

export function parseJson(json: string | null): unknown {
    if (json == undefined) {
        throw new Error("Failed to parse undefined as json");
    }
    return JSON.parse(json);
}
