<template>
	
	<view class="user-chat-lists">
		<view v-if="item.gstime" class="chat-time">{{item.gstime}}</view>
		<view class="user-chat-list" :class="{'user-chat-me' : item.inFrom}">
			<image v-if="!item.inFrom" :src="item.userimg" mode="aspectFill" lazy-load></image>
			<view class="user-chat-text">
				<!-- 文字 -->
				<text v-if="item.type=='text'">{{item.chatData}}</text>
				<!-- 图片 -->
				<image v-if="item.type=='img'" :src="item.chatData" mode="widthFix" lazy-load></image>
			</view>
			<image v-if="item.inFrom" :src="item.userimg" mode="aspectFill" lazy-load></image>
		</view>	
	</view>
</template>

<script>
	export default {
		props:{
			item:Object,
			index:Number
		}
	}
</script>

<style scoped>
.chat-time{
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 50upx 0;
	color: #a2a2a2;
	font-size: 24upx;
	
}
.user-chat-list{
	display: flex;
	padding: 20upx 0;
}
.user-chat-list>image{
	width: 100upx;
	height: 100upx;
	border-radius: 100%;
	flex-shrink: 0;
}
.user-chat-list .user-chat-text{
	position: relative;
	background: #f4f4f4;
	padding: 25upx;
	margin-left: 20upx;
	border-radius: 20upx;
	margin-right: 150upx;
}
.user-chat-list .user-chat-text::after{
	position: absolute;
	left: -25upx;
	top: 20upx;
	right: 0;
	content: '';
	width: 0;
	height: 0;
	border: 16upx solid #f4f4f4;
	border-color: transparent #f4f4f4 transparent transparent;
}
.user-chat-me{
	justify-content: flex-end;
}
.user-chat-me .user-chat-text{
	margin-left:150upx;
	margin-right: 20upx;
}
.user-chat-me .user-chat-text::after{
	left: auto;
	right: -30upx;
	border-color: transparent transparent transparent #f4f4f4 ;
}
.user-chat-list .user-chat-text>image{
	max-width: 180upx;
	max-height: 200upx;
}	
</style>
