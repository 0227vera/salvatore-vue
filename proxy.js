// id = D80524B3CAF5465C8E5D1B050C0486EF  lishimin111
// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJEODA1MjRCM0NBRjU0NjVDOEU1RDFCMDUwQzA0ODZFRiIsImlhdCI6MTU2Njc4NDg2NCwiZXhwIjoxNTY3Mzg5NjY0fQ.Ft_rvQ5Tl43ghYMOgg_8bvFLsrPw2Nj_ddXf-heZEqE'

const target = 'http://www.4yec.com/'; // 测试环境
const token =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIxNTAwMDAwMjAwMDQ3NTU2NzIzIiwiaWF0IjoxNTY2NDY5MzgzLCJleHAiOjE1NjcwNzQxODN9.cAtSGW4io0oYtrWo9ARm8Ry5m_OBtiOOm60d8-odaE8';

module.exports = {
	// 公文的代理
	'/multigwlz/api': {
		target,
		changeOrigin: true,
		headers: {
			Authorization: 'bearer ' + token
		}
	},
	'/multiengine': {
		target
	},
	// 将表单设计器代理回到本地处理
	'/cloud-static/thirdparty/form-ctor': {
		target: 'http://localhost:9002',
		pathRewrite: { '/cloud-static/thirdparty/form-ctor': '/' },
		changeOrigin: true
	}
};
