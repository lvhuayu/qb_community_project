<template>
	<view class="body">
		<view class="paper-list animated fadeInLeft fast" @tap="goChat">
			<!-- 图片 -->
			<view class="paper-uimg">
				<image :src="item.userimg" mode="aspectFill" ></image>
			</view>
			<!-- 信息 -->
			<view class="paper-umsg">
				<view class="umsg-top">
					<view class="top-name">{{item.username}}</view>
					<view class="top-time">{{item.time}}</view>
				</view>
				<view class="umsg-bot">
					<view class="bot-inner">{{item.msg}}</view>
					<view class="bot-badeg" v-if="item.noreadnum>0">
						<uni-badge :text="item.noreadnum" type="warning" />
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniBadge from "../../components/uni-badge/uni-badge.vue";
	export default {
		props:{
			item:Object,
			index:Number
		},
		components:{
			uniBadge
		},
		methods:{
			goChat(){
				if( !this.User.userinfo) {return uni.showToast({title:'请先登录吧~',icon:'none'})}
				uni.navigateTo({
					url:"../../pages/user-chat/user-chat"
				})
			}
		}
	}
	
</script>

<style scoped>
.body{
	padding: 0 20upx;
}
.paper-list{
	height: 120upx;
	border-bottom: 1upx solid #eee;
}
.paper-list .paper-uimg{
	width: 90upx;
	height:90upx;
	border-radius: 100%;
	overflow: hidden;
	float: left;
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	
}
.paper-list .paper-uimg image{
	width: 90upx;
	height: 90upx;
}
.paper-list .paper-umsg{
	height: 110upx;
	width: 85%;
	padding-left: 15upx;
	float: left;
	margin-left: 95upx;
}
	
.paper-list .paper-umsg .umsg-top{
	display: flex;
	justify-content: space-between;
	margin-top: 15upx;
	align-items: center;
}
.paper-list .paper-umsg .umsg-top .top-name{
	font-size: 30upx;
	color: #3333333;
}
.paper-list .paper-umsg .umsg-top .top-time{
	color: #ccc;
	font-size: 26upx;
}
.paper-list .paper-umsg .umsg-bot{
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.paper-list .paper-umsg .umsg-bot .bot-inner{
	flex: 90%;
	float: left;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	padding-right: 20upx;
	font-size: 26upx;
	color: #ccc;
}
.paper-list .paper-umsg .umsg-bot .bot-badeg{
	flex: 10%;
}	
</style>
