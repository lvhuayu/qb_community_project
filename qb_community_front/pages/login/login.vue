<template>
	<view>
		<!-- 状态栏 -->
		<uni-status-bar bgColor="#ffe933" ></uni-status-bar>
		<!-- 登录头 -->
		<view class="login-header">
			<view class="icon iconfont icon-guanbi icon" @tap="backIndex"></view>
			<image src="../../static/common/loginhead.png" mode="widthFix" lazy-load></image>
		</view>
		<view class="user-resetpwd">
			<!-- 账号密码登录 -->
			<template v-if="!status">
				<view class="login-name-box zh">
					<input type="text" class="uni-input" placeholder="昵称/手机号/邮箱" v-model="username" />
				</view>
				 <view class="login-pwd-box">
					 <input type="text" class="uni-input" placeholder="请输入密码" v-model="userpwd" />
					 <view class="forget">忘记密码?</view>
				 </view>
			</template >
			 <!-- 验证码登录 -->
			<template v-else>
				<view class="login-name-box">
					<view class="phone">+86</view>
					<input type="text" class="uni-input" placeholder="昵称/手机号/邮箱" v-model="userphone" />
				</view>
				 <view class="login-pwd-box">
					 <input type="text" class="uni-input" placeholder="请输入验证码" v-model="useryzm" />
					 <view class="forget" @tap="getCheckCode" >{{!codetime ? '获取验证码' : codetime +' s'}}</view>
				 </view>
			</template>
			<button class="user-set-logout " hover-class="btn-hover-class"
			 :class="{'user-set-logout-dis':disabled}"
			  type="primary" @tap="submit"
			  :disabled="disabled"
			  :loading="loading"
			  >登 录</button>
		</view>
		<!-- 验证码登录 -->
		<view class="code-login" @tap="changeStatus">
			<view>{{status?'账号密码登录':'验证码登录'}}</view>
			<view class="icon iconfont icon-iconfontzuojiantou"></view>
		</view>
		<!-- 第三方登录 -->
		<view class="other-login">
			<view class="tit">第三方登录</view>
			<other-login></other-login>
		</view>
		
		<!-- 服务条例 -->
		<view class="service-protocol">
			注册登录即代表您同意《仿糗百用户协议》
		</view>
	</view>
</template>

<script>
	import uniStatusBar from "../../components/uni-status-bar/uni-status-bar.vue";
	import  otherLogin  from "../../components/self/other-login.vue";
	export default {
		components:{
			uniStatusBar,
			otherLogin
		},
		data() {
			return {
				status:false,//false代表账号密码登录，true手机验证码登录
				username:"",
				userpwd:"",
				userphone:"",
				useryzm:"",
				checkcode:"",
				codetime:0,
				disabled:true,//按钮是否可以点击样式
				loading:false,//按钮点击加载动画
			}
		},
		watch:{
			username(val){
				this.onBtnChange();
			},
			userpwd(val){
				this.onBtnChange();
			},
			userphone(val){
				this.onBtnChange();
			},
			useryzm(val){
				this.onBtnChange();
			}
		},
		methods: {
			//初始化表单
			initInput(){
				this.username='';
				this.userpwd='';
				this.userphone='';
				this.useryzm='';
				this.disabled =true;
			},
			//判断是否可以登录
			onBtnChange(){
				if( (this.username && this.userpwd) || ( this.userphone && this.useryzm)){
					this.disabled = false;
					return;
				}
				return true;
			},
			//回到主页
			backIndex(){
				uni.navigateTo({
					url:"../index/index",
				})
			},
			// 验证
			checkInfo(){
				if( (this.username && this.userpwd) || ( this.userphone && this.useryzm) ){	
					return true;
				}
				uni.showToast({
					title:'请将数据填写完整',
					icon:'none'
				})
				return false;
			},
			//提交信息
			submit(){
				this.loading = true;
				setTimeout(()=>{
					this.loading=false;
				}, 500);
				//账号密码登录
				if(!this.status){
					return this.User.login({
						url:'user/login',
						data:{
							user_name:this.username,
							user_pwd:this.userpwd
						}
					})
				}else{
					//验证码登录
					uni.showLoading({ title: '登录中...', mask: true });
					this.uPhoneLogin();
				}	
			},
			//改变登录状态
			changeStatus(){
				this.status = !this.status;
				this.initInput();
			},
			//发送验证码
			getCheckCode(){
				if(!this.userphone){ return;};
				if(this.codetime>0){
					uni.showToast({
						title:'请'+this.codetime+'s后重试',
						icon:'none'
					});
					return;
				}
				//验证手机号合法性
				var phoneNum =/^1[34578]\d{9}$/;
				if(!phoneNum.test(this.userphone)){
					uni.showToast({
						title:'请输入正确手机号码',
						icon:'none'
					});
					return;
				}				
				//向服务器请求验证码
				this.codetime=60;
				var timer = setInterval(()=>{
					this.codetime--;
					if(this.codetime==0){
						clearInterval(timer);
						this.codetime=0;
					}
				},1000);
				this.sendCode(this.userphone);
			},
			//发送验证码
			async sendCode(phoneNum){
				let [err,res] = await this.$http.post('user/sendCode',{
					user_phone:phoneNum,
				})
				if(!err){
					if(res.data.code==200){
						uni.showToast({
							title:'验证码发送成功,请耐心等候',
							icon:'none'
						})
					}
				}else{
					uni.showToast({
						title:'验证码发送失败~',
						icon:'none'
					})
				}
			},
			//验证码登录
			async uPhoneLogin(){
				let [err,res] = await this.$http.post('user/uPhoneLogin',{
					user_phone:this.userphone,
					code:this.useryzm
				})
				if(!err){
					let data = res.data;
					if(data.code==200){
						data.data.password=false;
						this.User.userinfo = data.data;
						this.User.token = data.data.id;
						// 本地存储
						uni.setStorageSync("userinfo",this.User.userinfo);
						uni.setStorageSync("token", this.User.token);
						// 成功提示
						uni.hideLoading();
						uni.showToast({title:'登录成功',icon:'none'});
						setTimeout(()=>{
							// 返回上一步
							uni.navigateBack({ delta: 1 });
						},500)
					}else{
						uni.showToast({
							title:'验证码错误',
							icon:'none'
						})
					}
				}else{
					uni.showToast({
						title:'网络开小差啦~',
						icon:'none'
					})
				}
			}
		}
	}
</script>

<style>
.login-header{
	position: relative;
	width: 100%;
}
.login-header image{
	width: 100%;
}
.login-header .icon{
	position: absolute;
	top: 20upx;
	left: 25upx;
	font-size: 45upx;
	font-weight: bold;
}
.user-resetpwd{
	margin-top: 30upx;
	padding: 0 10upx;
	color: #999;
}
.user-resetpwd button{
	width: 84%;
	margin: 30upx auto;
	background: #ffe933;
	color: #333333;
}
.user-resetpwd input{
	padding: 25upx 10upx;
	padding-right: 160upx;
	font-weight: 700;	
}
.zh>input{
	padding: 25upx 10upx !important;
}
.login-pwd-box{
	position: relative;
}
.login-pwd-box .forget{
	right: 15upx;
	top:50%;
	height: 60upx;
	position: absolute;
	font-size: 28upx;
	transform: translateY(-50%);
	width: 150upx;
	background: #ffe933;
	text-align: center;
	line-height: 60upx;
	border-radius: 5upx;
	color: #999;
}
.login-pwd-box .yzm{
	background: #666;
}
.login-name-box{
	position: relative;
}
.login-name-box .phone{
	position: absolute;
	font-size: 40upx;
	top: 50%;
	transform: translateY(-53.3%);
	font-weight: 700;
	color: #333;
}
.login-name-box>input{
	padding-left: 80upx;
}
.btn-hover-class{
	background: #f4f4f4 !important;
	color: #666 !important;
}
.user-set-logout-dis{
	background: #f4f4f4 !important;
	color: #999 !important;
}
.uni-input{
	padding-left: 30upx;
	height: 60upx;
	border-bottom: 1upx solid #eee;
	font-size:32upx;
}

.code-login{
	padding: 10upx 60upx;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	height: 50upx;
}
.code-login>view{
	color: #999;
}
.code-login>view:first-child{
	font-size: 28upx;
}
.code-login>view:last-child{
	font-size: 30upx;
}
.other-login{
	margin-top: 20upx;
}
.other-login .tit{
	position: relative;
	display: flex;
	justify-content: center;
	font-size: 32upx;
	color: #999;
}
.other-login .tit::before,.other-login .tit::after{
	position: absolute;
	display: block;
	content: '';
	height: 1upx;
	width:100upx;
	background: #999;
	top: 50%;
}
.other-login .tit::before{
	left: 25%;
}
.other-login .tit::after{
	right: 25%;
}
.service-protocol{
	font-size: 28upx;
	color: #999;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20upx 0;
}
</style>
