import request from "../request";


export function scoreDetail(data) {
  return request({
    url: `/api/user/scoreDetail`,
    method: 'get',
    params: data,
  });
}
export default {
  scoreDetail
}
