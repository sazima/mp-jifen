import request from "../request";


export function adminProductList(data ) {
  return request({
    url: `/mp-api/admin/product/list`,
    method: 'get',
    params: data,
  });
}

export function list(data ) {
  return request({
    url: `/mp-api/product/list`,
    method: 'get',
    params: data,
  });
}
export function detail(data ) {
  return request({
    url: `/mp-api/product/detail`,
    method: 'get',
    params: data,
  });
}
export function editOrCreate(data ) {
  return request({
    url: `/mp-api/admin/product/editOrCreate`,
    method: 'post',
    data: data,
  });
}


export function miniAppEditOrCreate(data, token) {
  const FormData = require('form-data');

  const baseUrl = process.env.VUE_APP_BASE_URL
  const url = baseUrl + '/mp-api/admin/product/miniAppEditOrCreate?token=' + token //上传地址
  let formData = new FormData();
  var obj = {'0':'a','1':'b','2':'c'};

  Object.keys(data).forEach(function(key){
    formData.append(key, data[key]);
  });
  request({
    url: url,
    method: 'post',
    formData,
    headers: {
      "Content-Type": "multipart/form-data",
    }
  })

}
  // return request({
  //   url: `/mp-api/admin/product/editOrCreate`,
  //   method: 'post',
  //   data: data,
  // });
export function del(data ) {
  return request({
    url: `/mp-api/admin/product/del`,
    method: 'post',
    data: data,
  });
}
export function exchange(data ) {
  return request({
    url: `/mp-api/product/exchange`,
    method: 'post',
    data: data,
  });
}
export function exchangeList(data) {
  return request({
    url: `/mp-api/product/exchangeList`,
    method: 'get',
    params: data,
  });
}
export default {
  adminProductList,
  editOrCreate,
miniAppEditOrCreate,
  del,
  list,
  detail,
  exchange,
  exchangeList
}
