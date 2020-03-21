export function deepCopy(obj) {
    // TODO: this does not work if you store functions in the state, use library instead
    return JSON.parse(JSON.stringify(obj));
}