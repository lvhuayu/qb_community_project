<template>
	<view>
		<!-- 未登录 -->
		<template v-if="!isLogin">
			<view class="no-login">登录APP，体验更多功能</view>
			<!-- 第三方登录 -->
			<other-login @logining="checkLogin()"></other-login>
			<!-- 账号密码登录 -->
			<view class="account-login">
				<button type="primary" @tap="goLogin">账号密码登录</button>
			</view>	
		</template>
		<!-- 已登录 -->
		<template v-else>
			<!-- 已登录 -->
			<self-info :selfInfo="selfInfo"></self-info>
		</template>
		
		
		<!-- 基础数据 -->
		<self-base-data :baseData="baseData" ></self-base-data>
		
		<!-- 广告区 -->
		<view class="adv-area">
			<image src="../../static/demo/156801425158015611047757442019-6-21web3_1.jpg"></image>
		</view>
		
		<!-- 功能列表 -->
		<block v-for="(item,index) in list" :key="index">
			<self-item-list :item="item" :index="index"></self-item-list>
		</block>
		
	</view>
</template>

<script>
	import selfItemList from "../../components/self/self-item-list.vue";
	import selfInfo from "../../components/self/self-info.vue";
	import otherLogin from "../../components/self/other-login.vue";
	import selfBaseData from "../../components/self/self-base-data.vue";
	export default {
		components:{
			selfItemList,
			selfInfo,
			otherLogin,
			selfBaseData
		},
		data() {
			return {
				isLogin:false,
				//用户登录信息
				selfInfo:{
					userimg:"",
					username:"",
					totalnum:199,
					todaynum:6
				},
				//基础数据列表
				baseData:[
					{name:"糗事",num:6},
					{name:"动态",num:136},
					{name:"评论",num:88},
					{name:"收藏",num:99},
				],
				//菜单列表
				list:[
					{ icon:"lishi" ,name:"浏览历史",iconColor:"blue",clickType:"",url:""},
					{ icon:"renzheng"  ,name:"糗百认证",iconColor:"red",clickType:"",url:""},
					{ icon:"btn-check"  ,name:"审核糗事",iconColor:"blue1",clickType:"",url:""},
				],
			}
		},
		onNavigationBarButtonTap(e) {
			if(e.index==0){
				this.User.navigate({
					url:"../user-set/user-set",
				})
			}
		},
		onShow() {
			this.checkLogin();
		},
		methods: {
			checkLogin(){
				if(!this.User.token){
					this.isLogin = false;
					this.selfInfo = {
						userimg:"",
						username:"",
						totalnum:3,
						todaynum:103
					}
					return;
				}
				let userinfo = this.User.userinfo;
				this.selfInfo.userimg = userinfo.userpic;
				this.selfInfo.username = userinfo.username;
				this.isLogin = true;
			},
			goLogin(){
				uni.navigateTo({
					url:"../login/login"
				})
			}
		}
	}
</script>

<style>
.no-login{
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 30upx;
}
.account-login button{
	width: 60%;
	margin: 20upx auto;
	border-radius: 50upx;
	font-size: 30upx !important;
}
.adv-area{
	padding: 25upx;
	height: 280upx;
}
.adv-area>image{
	width: 100%;
	height: 100%;
	border-radius: 15upx;
}







/* 已登录 */
	

</style>
