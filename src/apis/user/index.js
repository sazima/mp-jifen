import request from "../request";

export function login(data) {
  return request({
    url: `/mp-api/user/login`,
    method: 'post',
    data: data,
  });
}

export function loginMiniApp(data) {
  return request({
    url: `/mp-api/user/loginMiniApp`,
    method: 'get',
    params: data,
  });
}
export function detail() {
  return request({
    url: `/mp-api/user/detail`,
    method: 'get'
  });
}
export function edit(data) {
  return request({
    url: `/mp-api/user/edit`,
    method: 'post',
    data: data
  });
}
export function bind(data) {
  return request({
    url: `/mp-api/user/bind`,
    method: 'post',
    data: data
  });
}

export function getPartnerDetail() {
  return request({
    url: `/mp-api/user/partnerDetail`,
    method: 'get'
  });
}

export function switchAccount(data) {
  return request({
    url: `/mp-api/user/switch`,
    method: 'post',
    data: data,
  });
}
export default {
  login,
  detail,
  edit,
  switchAccount,
  loginMiniApp,
  getPartnerDetail,
  bind
}
