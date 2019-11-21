<template>
	
	<view class="user-info" @tap="goSelfSpace">
		<view class="info-img">
			<image :src="selfInfo.userimg"  lazy-load></image>
		</view>
		<view class="info-msg">
			<view class="msg-name">{{selfInfo.username}}</view>
			<view class="msg-data">总访客 {{selfInfo.totalnum}} 今日 {{selfInfo.todaynum}}</view>
		</view>
		<view class="info-icon">
			<view class="icon iconfont icon-arrow-right"></view>
		</view>
	</view>
	
</template>

<script>
	
	export default {
		props:{
			selfInfo:Object
		},
		methods:{
			goSelfSpace(){
				uni.navigateTo({
					url:'../../pages/user-space/user-space?userid='+this.User.userinfo.id,
				})
			}
		}
	}
	
</script>

<style scoped>
.user-info{
	padding: 40upx 30upx;
	display: flex;
	align-items: center;
}
.user-info .info-img{
	display: flex;
	align-items: center;
}
.user-info .info-img image{
	width: 100upx;
	height: 100upx;
	border-radius: 100%;
	
}
.user-info .info-msg{
	flex: 1;
	margin-left: 20upx;
}
.user-info .info-msg .msg-name{
	font-size: 32upx;
	color: #333333;
}
.user-info .info-msg .msg-data{
	font-size: 26upx;
	color: #ccc;
}
.user-info .info-icon>view{
	color: #333333;
}	

</style>
