<template>
	<view class="user-about-app">
		
		<view class="about-app-img">
			<image src="../../static/common/logo.png" mode="widthFix" lazy-load></image>
		</view>
		<view class="about-app-ver">version 1.0.0</view>
		<view class="about-app-list">
			<block v-for="(item,index) in list" :key="index">
				<self-item-list :item="item" :index="index"></self-item-list>
			</block>
		</view>
		
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
					{ name:"新版本检测",iconColor:"",clickType:"",url:""},
					{ name:"仿糗事百科用户协议",iconColor:"",clickType:"",url:""},
				],	
			}
		},
		methods: {
			
		}
	}
</script>

<style>
.about-app-img{
	padding: 50upx 0;
	display: flex;
	align-items: center;
	justify-content: center;
}
.about-app-ver{
	padding: 30upx 0;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #999;
}
.about-app-img>view{
	text-align: center;
	padding: 30upx 0;
	color: #ccc;
}
</style>
