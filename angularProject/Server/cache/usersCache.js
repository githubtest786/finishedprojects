const usersCache = new Map(); // Saves the JWTs as keys and user information as values.

async function getData(token) {
    return usersCache.get(token);
}

async function setData(token, userData) {
    usersCache.set(token, userData);
    return ;
}

async function getCache() {
    return usersCache;
}

async function deleteData(token) {
    usersCache.delete(token);
    return ;
}

module.exports = {
    getData,
    setData,
    getCache,
    deleteData
}