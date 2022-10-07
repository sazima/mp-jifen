import request from "../request";


export function get_list() {
  return request({
    url: `/mp-api/action_history/list`,
    method: 'get',
  });
}

export default {
  get_list
}
