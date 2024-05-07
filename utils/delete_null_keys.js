// Function to remove null keys from an object and its nested arrays
function removeNullKeys(obj) {
    for (let key in obj) {
        if (obj[key] === null) {
            delete obj[key];
        } else if (Array.isArray(obj[key])) {
            for (let i = 0; i < obj[key].length; i++) {
                if (typeof obj[key][i] === 'object' && obj[key][i] !== null) {
                    removeNullKeys(obj[key][i]); // Recursively check and remove null keys within nested objects
                }
            }
        }
    }
}
module.exports = removeNullKeys;