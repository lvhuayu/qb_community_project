<template>
	
	<view class="other-login-model">
		<block v-for="(item,index) in providerList" :key="index">
			<view >
				<view class="icon iconfont" :class="['icon-'+item.icon]"  @tap="tologin(item)"></view>
			</view>
		</block>
	</view>
	
</template>

<script>
	
	export default {
		props:{
			
		},
		data() {
			return {
				providerList: []
			}
		},
		onReady() {
			this.getLoginAuth();
		},
		methods:{
			//获取登录渠道
			getLoginAuth(){
				uni.getProvider({
					service: 'oauth',
					success: (result) => {
						for(var item of result.provider){
							if(item !='xiaomi'){
								if(item=='weixin'){
									this.providerList.push({
										name: '微信登录',
										icon:'weixin',
										id: item
									})
								}else if(item =='qq'){
									this.providerList.push({
										name: 'QQ登录',
										icon:'qq',
										id: item
									})
								}else if(item=='sinaweibo'){
									this.providerList.push({
										name: '微博登录',
										icon:'weibo1',
										id: item
									})
								}
							}
						}
					},
					fail: (error) => {
						console.log('获取登录通道失败', error);
					}
				})
				
			},
			tologin(provider) {
				uni.login({
					provider: provider.id,
					success: (res) => {
						// console.log(JSON.stringify(res))
						// 更新保存在 store 中的登录状态
						uni.getUserInfo({
						  provider:provider.id,
						  success: (infoRes)=> {
							  // console.log(JSON.stringify(infoRes))
							  this.loginEvent(this.User.__formatOtherLogin(provider.id,Object.assign(infoRes,res)))
						  }
						});
					},			
					fail: (err) => {
						console.log('login fail:', err);
					}
				});
			},
			async loginEvent(data){
				let res = await this.User.othorLogin({
					url:'user/otherLogin',
					data:data,
				});
				if (res) {
					// 登录成功，重新加载数据
					this.$emit('logining')
				}
			}
		}
	}
	
</script>

<style scoped>
.other-login-model{
	width: 60%;
	background: eee;
	margin: 15upx auto;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1upx solid #eee;
}

.other-login-model>view .icon-weibo1{
	font-size: 90upx;
	color: #e84118;
}
.other-login-model>view .icon-qq{
	font-size: 100upx;
	color:#00a8ff;
}
.other-login-model>view .icon-weixin{
	font-size: 90upx;
	color:#4cd137;
}
</style>
