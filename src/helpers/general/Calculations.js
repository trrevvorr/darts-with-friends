export function deepCopy(obj) {
    // TODO: this does not work if you store functions in the state, use library instead
    return JSON.parse(JSON.stringify(obj));
}

function doDebug() {
    return new URLSearchParams(window.location.search).has('debug');
}
const DO_DEBUG = doDebug();

export function debugLog(title, obj) {
    if (DO_DEBUG) {
        console.log("DEBUG", title, obj);
    }
}