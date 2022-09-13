import request from "../request";

export function login(data) {
  return request({
    url: `/api/user/login`,
    method: 'post',
    data: data,
  });
}

export function loginMiniApp(data) {
  return request({
    url: `/api/user/loginMiniApp`,
    method: 'get',
    params: data,
  });
}
export function detail() {
  return request({
    url: `/api/user/detail`,
    method: 'get'
  });
}
export function edit(data) {
  return request({
    url: `/api/user/edit`,
    method: 'post',
    data: data
  });
}

export function switchAccount(data) {
  return request({
    url: `/api/user/switch`,
    method: 'post',
    data: data,
  });
}
export default {
  login,
  detail,
  edit,
  switchAccount,
  loginMiniApp
}
