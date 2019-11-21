<template>
	<view class="hot-class">
		<view class="hot-top">
			<view class="hot-top-l">
				热门分类
			</view>
			<view class="hot-top-r" @tap="goTopicNav">
				更多
				<view class="icon iconfont icon-iconfontzuojiantou"></view>
			</view>
		</view>
		<view class="hot-cont">
			<block v-for="(item,index) in classnav" :key="index">
				<view>{{item.name}}</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			classnav:Array
		},
		methods:{
			goTopicNav(){
				uni.navigateTo({
					url:"../../pages/topic-nav/topic-nav"
				})
			}
		}
	}
</script>

<style scoped>
	/* 热门分类 */
	.hot-class {
		width: 90%;
		margin: 0 auto;
		padding: 10upx;
		border-top: 1upx solid #eee;
		border-bottom: 1upx solid #eee;
		height: 150upx;
	}
	
	.hot-class .hot-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 60upx;
	}
	
	.hot-class .hot-top .hot-top-l {
		color: #333;
	}
	
	.hot-class .hot-top .hot-top-r {
		display: flex;
		align-items: center;
		color: #999;
	}
	
	.hot-class .hot-top .hot-top-r>view {
		font-size: 25upx;
		margin-left: 8upx;
		display: flex;
		align-items: center;
	}
	
	.hot-class .hot-cont {
		display: flex;
		align-items: center;
		justify-content: space-between;
	
	}
	
	.hot-class .hot-cont>view {
		background: #ecf0f1;
		padding: 5upx 20upx;
		color: #999;
		font-size: 24upx;
		margin-top: 20upx;
		border-radius: 5upx;
	}
</style>
