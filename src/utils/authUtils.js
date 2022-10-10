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

function setUserDetail(userDetail) {
    localStorage.setItem('userDetail', JSON.stringify(userDetail))
}
function getUserDetail() {
    const res =  localStorage.getItem('userDetail')
    if (res == null) {
        return null;
    }
    try {
        return JSON.parse(res)
    } catch (error) {
        console.error(error);
        return null;
    }

}

function    setActionList(actionList) {
    localStorage.setItem('actionList', JSON.stringify(actionList))
}

function getActionList() {
    const res =  localStorage.getItem('actionList')
    if (res == null) {
        return [];
    }
    try {
        return JSON.parse(res)
    } catch (error) {
        console.error(error);
        return [];
    }

}
function    setProductList(actionList) {
    localStorage.setItem('prolist', JSON.stringify(actionList))
}

function getProductList() {
    const res =  localStorage.getItem('prolist')
    if (res == null) {
        return [];
    }
    try {
        return JSON.parse(res)
    } catch (error) {
        console.error(error);
        return [];
    }

}

function    setTaskList(actionList) {
    localStorage.setItem('tasklist', JSON.stringify(actionList))
}

function getTaskList() {
    const res =  localStorage.getItem('tasklist')
    if (res == null) {
        return [];
    }
    try {
        return JSON.parse(res)
    } catch (error) {
        console.error(error);
        return [];
    }

}
export {getUserInfo, setToken, cleanToken, getUserDetail, setUserDetail, getActionList, setActionList, setProductList, getProductList, getTaskList, setTaskList}
