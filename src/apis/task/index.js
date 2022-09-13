import request from "../request";

export function adminTaskList(data) {
  return request({
    url: `/api/admin/task/list`,
    method: 'get',
    params: data,
  });
}

export function list(data) {
  return request({
    url: `/api/task/list`,
    method: 'get',
    params: data,
  });
}
export function add(data) {
  return request({
    url: `/api/admin/task/add`,
    method: 'post',
    data: data,
  });
}
export function edit(data) {
  return request({
    url: `/api/admin/task/edit`,
    method: 'post',
    data: data,
  });
}

export function sigin(data) {
  return request({
    url: `/api/task/sigin`,
    method: 'post',
    data: data,
  });
}

export function del(data) {
  return request({
    url: `/api/admin/task/delete`,
    method: 'post',
    data: data,
  });
}

export default {
  adminTaskList,
  add,
  edit,
  del,
  list,
  sigin
}
