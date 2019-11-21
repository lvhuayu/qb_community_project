<template>
	<view class="rec-list" @tap="goTopicDetail">
		<view class="list-img">
			<image :src="item.titleimg" lazy-load></image>
		</view>
		<view class="list-cont">
			<view class="cont-tit">{{item.title}}</view>
			<view class="cont-intr">{{item.introduce}}</view>
			<view class="cont-num">
				动态 {{item.totalnum}} 今日 {{item.todaynum}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			item:Object,
			index:Number,
			isChange:{
				type:Boolean,
				default:false
			}
		},
		methods:{
			goTopicDetail(){
				if(this.isChange){
					uni.$emit('changeTopic',{
						id:this.item.id,
						title:this.item.title
					})
					uni.navigateBack({
						delta:1
					})
					return;
				}
				uni.navigateTo({
					url:`../../pages/topic-detail/topic-detail?detailTopic=${JSON.stringify(this.item)}`,
				})
			}
		}
	}
</script>

<style scoped>
/* 最近更新列表 */
.rec-list {
	box-sizing: border-box;
	padding: 10upx 0;
	display: flex;
	border-bottom: 1upx solid #eee;
	margin: 20upx 0;
}

.rec-list .list-img image {
	width: 260upx;
	height: 260upx;
	border-radius: 10upx;
}

.rec-list .list-cont {
	height: 260upx;
	padding: 0 0 0 35upx;
}

.rec-list .list-cont .cont-tit {
	font-size: 34upx;
	color: #333;
	margin-top: -10upx;
}

.rec-list .list-cont .cont-intr {
	color: #999;
	font-size: 26upx;
}

.rec-list .list-cont .cont-num {
	color: #999;
	font-size: 26upx;
}
</style>
