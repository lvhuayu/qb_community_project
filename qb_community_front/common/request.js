import config from './config.js';
import user from './user.js';
export default{
	config:{
		baseURL:config.baseURL,
		header:{
			'Content-Type':'application/json;charset=UTF-8',
			'Content-Type':'application/x-www-form-urlencoded'
		},
		data:{},
		method:'GET',
		dataType:'json',
	},
	request(options={}){
		options.header = options.header || this.config.header;
		options.method = options.method || this.config.method;
		options.dataType = options.dataType || this.config.dataType;
		options.url = this.config.baseURL +options.url;
		//验证token-->现在不会
		return uni.request(options);
	},
	
	get(url,data,options={}){
		options.url=url;
		options.data=data;
		options.method='get';
		return this.request(options);
	},
	
	post(url,data,options={}){
		options.url=url;
		options.data=data;
		options.method='post';
		return this.request(options);
	},
	// 上传图片
	upload(url,options = {}){
		console.log(options.formData )
		console.log(options.filePath)
		console.log(options.user_id)
		options.url = this.config.baseUrl+url;
		options.header = options.header || this.config.header;
		options.fileType = options.fileType || "image";
		options.formData = options.formData || {};
		options.filePath = options.filePath;
		options.name = options.file;
		return uni.uploadFile(options);
	},
}