import $http from "./request.js";
export default{
	//用户信息
	userinfo:false,
	//用户token
	token:false,
	//用户相关统计
	counts:{},
	// 初始化
	__init(){
		console.log('1111')
		// 获取用户信息
		this.userinfo = uni.getStorageSync("userinfo");
		this.token = uni.getStorageSync("token");
		// 如果用户id存在，则连接 
		if (this.userinfo.id) {
			// 连接socket
			// $chat.Open();
		}
	},
	//权限跳转验证方法
	navigate(options,type='navigateTo'){
		if(!this.token){
			uni.showToast({title:'请先登录~',icon:'none'})
			return  uni.navigateTo({ url:'/pages/login/login' })
		}
		switch (type){
			case "navigateTo":
			uni.navigateTo(options);
				break;
			case "redirectTo":
			uni.redirectTo(options);
				break;
			case "reLaunch":
			uni.reLaunch(options);
				break;
			case "switchTab":
			uni.switchTab(options);
				break;
		}
	},
	//登录
	async login(options={}){
		uni.showLoading({ title: '登录中...', mask: true });
		let [err,res] =await $http.post(options.url,options.data);
		if(!err){
			let data = res.data;
			if(data.code==200){
				this.userinfo = data.data;
				this.token = data.data.id;
				// 本地存储
				uni.setStorageSync("userinfo",this.userinfo);
				uni.setStorageSync("token", this.token);
				// 成功提示
				uni.hideLoading();
				uni.showToast({title:'登录成功',icon:'none'});
				setTimeout(()=>{
					// 返回上一步
					if (!options.Noback) {
						uni.navigateBack({ delta: 1 });
					}
				},500)
				return true;
			}else{
				uni.showToast({
					title:'用户名或密码错误',
					icon:'none'
				})
				return false;
			}
		}else{
			uni.showToast({
				title:'系统错误~',
				icon:'none'
			})
		}
	},
	//第三方登录
	async othorLogin(options={}){
		uni.showLoading({ title: '登录中...', mask: true });
		let [err,res] =await $http.post(options.url,options.data);
		if(!err){
			let data = res.data;
			if(data.code==200){
				let user = data.data
				let userinfo = {
					"id": user.id,
					"username":user.username,
					"userpic": user.userpic || 'http://pic136.nipic.com/file/20170725/10673188_152559977000_2.jpg',
					"password":user.password == null ? false : user.password,
					"phone": user.phone == null ? false : user.phone,
					"email": user.email == null ? false : user.email,
					"status": 1,
					"create_time":user.create_time == null ? false : user.create_time,
					"userinfo":user.userinfo ? user.userinfo : false
				}
				this.userinfo = userinfo;
				this.token = userinfo.id;
				// 本地存储
				uni.setStorageSync("userinfo",this.userinfo);
				uni.setStorageSync("token", this.token);
				// 成功提示
				uni.hideLoading();
				uni.showToast({title:'登录成功',icon:'none'});
				setTimeout(()=>{
					// 返回上一步
					if (!options.Noback) {
						uni.navigateBack({ delta: 1 });
					}
				},500)
				return true;
			}else{
				uni.showToast({
					title:'登录失败~',
					icon:'none'
				})
				return false;
			}
		}else{
			uni.showToast({
				title:'系统错误~',
				icon:'none'
			})
			return false;
		}
	},
	//获取用户统计数据
	async getCounts(){
		let [err,res] = await $http.get('user/getCounts')
	},
	//退出登录
	async logout(showToast = true){
		let [err,res] = await $http.post('user/logout')
		if(!err){
			let data = res.data;
			if(data.code==200){
				// 清除缓存
				uni.removeStorageSync('userinfo');
				uni.removeStorageSync('token');
				uni.removeStorageSync('counts');
				// 清除状态
				this.token = false;
				this.userinfo = false;
				this.counts = {};
				// 返回home页面
				uni.switchTab({ url:"/pages/self/self" })
				// 退出成功
				if (showToast) {
					return uni.showToast({ title: '退出登录成功' });
				}
			}
		}else{
			return uni.showToast({ title: '退出登录失败' });
		}
	},
	// 转换第三方登录格式
	__formatOtherLogin(provider,options){
		return {
			provider:provider,
			openid:options.userInfo.unionId || options.userInfo.openId,
			expires_in:options.authResult.expires_in,
			nickName:options.userInfo.nickName,
			avatarUrl:options.userInfo.avatarUrl,
		}
	},
	//初始化数据
	__init(){
		
	},
}