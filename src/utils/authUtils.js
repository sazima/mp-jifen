function getUserInfo() {
    const token = localStorage.getItem("token")
    if (!token){
        return null;
    }
    return {
        token,
        nickName: localStorage.getItem("nickName") || email
    }
}
function setToken(token, nickname) {
    localStorage.setItem('token', token)
    localStorage.setItem('nickName', nickname)
}

function cleanToken() {
    localStorage.removeItem('token')
    localStorage.removeItem('nickName')
}
export {getUserInfo, setToken, cleanToken}
