import request from "../request";


export function get_list(page) {
  return request({
    url: `/mp-api/action_history/list?page=`+page,
    method: 'get',
  });
}

export default {
  get_list
}
