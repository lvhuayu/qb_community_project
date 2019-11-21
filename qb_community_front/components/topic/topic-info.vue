<template>
	<view>
	<!-- 模糊背景 -->
		<view class="topic-bg">
			<image :src="item.topicBg" mode="aspectFill" lazy-load></image>
		</view>
		<!-- 话题信息 -->
		<view class="topic-msg">
			<view class="msg-img">
				<view class="img">
					<image :src="item.titleImg" mode=""></image>
				</view>
				<view class="tit">{{item.title}}</view>
			</view>
			<view class="msg-num">
				动态 {{item.totalnum}} &nbsp;&nbsp; 今日 {{item.todaynum}}
			</view>
			<view class="msg-intr">
				{{item.introduce}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			item:Object
		}
	}
</script>

<style scoped>
.topic-bg{
	width: 100%;
	height: 330upx;
	position: relative;
	overflow: hidden;
}
.topic-bg image{
	width: 100%;
	position: absolute;
	filter: blur(5px);
	z-index: -1;
}
.topic-msg{
	padding: 40upx;
	background: #fff;
}
.topic-msg .msg-img{
	margin-top: -110upx;
	display: flex;
	align-items: flex-end;
	z-index: 999;
}
.topic-msg .msg-img .img{
	width: 140upx;
	height: 140upx;
	border-radius: 10upx;
	overflow: hidden;
}
.topic-msg .msg-img .img image{
	width: 140upx;
	height: 140upx;
}
.topic-msg .msg-img .tit{
	z-index: 1;
	margin-left: 20upx;
	font-size: 34upx;
}
.topic-msg .msg-num{
	color: #ccc;
	padding: 15upx 5upx;
	font-size: 26upx;
}
.topic-msg .msg-intr{
	color: #999;
}
</style>
