<template>
		<!-- 评论列表 -->
		<view class="uni-comment">
			<view class="u-comment-title">最新评论 {{commentData.count}}</view>
			 <block v-for="(item,index) in commentData.list" :key="index">
				 <!-- 评论列表 -->
				 <view class="uni-comment-list " :class="{'u-comment-list-child':(item.fid>0)}" >
				 	<view class="uni-comment-face"><image :src="item.userimg" mode="widthFix"></image></view>
				 	<view class="uni-comment-body" @tap="replyComment(item)">
				 		<view class="uni-comment-top" >
				 			<text>{{item.username}}</text>
				 		</view>
				 		<view class="uni-comment-content">{{item.data}}</view>
				 		<view class="uni-comment-date">
				 			<view>{{item.time}}</view>
				 		</view>
				 	</view>
				 </view>
			 </block>
		</view>
	
</template>

<script>
	export default {
		props:{
			commentData:Object,
		},
		methods:{
			 replyComment(item){
				this.$emit('replyComment',item)
			},
		}
	}
</script>

<style scoped>
.uni-comment{
	padding: 20upx;
	margin-top: 20upx;
	background: #fff;
	
}
.u-comment-title{
	height: 80upx;
	line-height: 80upx;
	font-weight: 700;
}
.uni-comment-replay-btn{
	border: 1upx solid #eee;
}
.u-comment-list-child{
	padding: 20upx;
	background: #f4f4f4;
	box-sizing: border-box;
	width: auto;
	margin: 0;
	margin-left: 70upx;
	border-bottom: 1px solid #eee;
}	
	
</style>
