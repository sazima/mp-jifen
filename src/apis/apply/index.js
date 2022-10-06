import request from "../request";


export function applyUse(data) {
  return request({
    url: `/mp-api/apply/`,
    method: 'post',
    data: data,
  });
}

export function listApply(params) {
  return request({
    url: `/mp-api/apply/`,
    method: 'get',
    params: params,
  });
}


export function check(data) {
  return request({
    url: `/mp-api/apply/check`,
    method: 'post',
    data: data,
  });
}

export default {
  applyUse,
  listApply,
  check
}
