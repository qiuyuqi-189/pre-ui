import request from '@/utils/request'

// 测试模块

export function fetchList() {
  return request({
    url: '/test/list',
    method: 'get'
  })
}

// 删除
export const deleteTest = (testid) => {
  return request({
    url: '/test/' + testid,
    method: 'delete'
  })
}

// 修改
export const updateTest = (data) => {
  return request({
    url: '/test',
    method: 'put',
    data: data
  })
}

// 新增
export function addTest(data) {
  return request({
    url: '/test',
    method: 'post',
    data: data
  })
}

// 查询
export function viewList(params) {
  return request({
    url: '/test/list',
    method: 'get',
    params
  })
}
