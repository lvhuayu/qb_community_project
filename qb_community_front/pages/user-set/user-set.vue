<template>
	
	<view class="body">
		<block v-for="(item,index) in list" :key="index">
			<self-item-list :item="item" :index="index"></self-item-list>
		</block>
		<button class="user-set-logout" type="primary" @tap="User.logout()">退出登录</button>
	</view>
</template>

<script>
	import selfItemList from "../../components/self/self-item-list.vue";
	export default {
		components:{
			selfItemList
		},
		data() {
			return {
				//菜单列表
				list:[
					{ name:"账号与安全",iconColor:"",clickType:"navigateTo",url:"../../pages/user-set-resetpwd/user-set-resetpwd?password="+this.User.userinfo.password},
					{ name:"绑定邮箱",iconColor:"",clickType:"navigateTo",url:"../../pages/user-set-email/user-set-email?email="+this.User.userinfo.email || false },
					{ name:"资料编辑",iconColor:"",clickType:"navigateTo",url:"../../pages/user-set-userinfo/user-set-userinfo?userinfo="+JSON.stringify(this.User.userinfo) ||false },
					{ name:"小纸条",iconColor:"",clickType:"navigateTo",url:"../../pages/paper/paper"},
					{ name:"清除缓存",iconColor:"",clickType:"clear",url:""},
					{ name:"意见反馈",iconColor:"",clickType:"navigateTo",url:"../../pages/user-set-help/user-set-help"},
					{ name:"关于仿糗事百科",iconColor:"",clickType:"navigateTo",url:"../../pages/about-app/about-app"},
				],	
			}
		},
		
		methods: {
			f(){
				uni.navigateTo({
					url:"../paper/paper",
				})
			}
		}
	}
</script>

<style>
.body button{
	width: 84%;
	margin: 30upx auto;
	background: #ffe933;
	color: #333333;
}
</style>
