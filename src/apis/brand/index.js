import request from "../request";

export function editOrCreate(data ) {
  return request({
    url: `/mp-api/admin/brand/insertOrEdit`,
    method: 'post',
    data: data,
  });
}
export function listAdmin(data ) {
  return request({
    url: `/mp-api/admin/brand/listAdmin`,
    method: 'post',
    data: data,
  });
}

export function list(data ) {
  return request({
    url: `/mp-api/brand/list`,
    method: 'post',
    data: data,
  });
}



export function del(data ) {
  return request({
    url: `/mp-api/admin/brand/del`,
    method: 'post',
    data: data,
  });
}
export default {
  editOrCreate,
  listAdmin,
  list,
  del
}
