import { replaceItemAtIndex } from "../../src/utils";

describe("replaceItemAtIndex", () => {
    test("Item at specified index should be replaced by given item", () => {
        const array = [1, 3, 4];
        const indexToReplace = 2;
        expect(replaceItemAtIndex(array, indexToReplace, 22)).toStrictEqual([
            1, 3, 22,
        ]);
    });

    test("Replacing non-existent item results in an error", () => {
        const array = [1, 3, 4];
        const indexWithNoItem = 4;
        const negativeIndex = -1;
        expect(() => replaceItemAtIndex(array, indexWithNoItem, 22)).toThrow();
        expect(() => replaceItemAtIndex(array, negativeIndex, 22)).toThrow();
    });
});
