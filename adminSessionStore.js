const adminSession = []

function adminSessionActive(username) {
    return !!username && adminSession.includes(username)
}

function addAdminSession(username) {
    if (!username || adminSession.includes(username)) return adminSession
    adminSession.push(username)
    return adminSession
}

function removeAdminSession(username) {
    const idx = adminSession.indexOf(username)
    if (idx !== -1) adminSession.splice(idx, 1)
    return adminSession
}

module.exports = {
    adminSession,
    adminSessionActive,
    addAdminSession,
    removeAdminSession
}
