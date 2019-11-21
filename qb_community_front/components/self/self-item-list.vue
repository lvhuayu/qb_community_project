<template>
	<!-- 设置列表 -->
	<view class="handle-list"  @tap="clickEvent">
		<view class="handle-list-item">
			<view class="icon-box">
				<view  class="icon iconfont" :class="['icon-'+item.icon,item.iconColor]"></view>
			</view>
			<view class="list-text">{{item.name}}</view>
			<view class="jt-box">
				<view class="icon iconfont icon-arrow-right"></view>
			</view>
			
		</view>
	</view>
</template>
<script>
	export default {
		props:{
			item:Object,
			index:Number
		},
		methods:{
			clickEvent(){
				switch(this.item.clickType){
					case "navigateTo":
					if(this.item.url){ uni.navigateTo({ url:this.item.url }); };
					 break;
					case "clear":
					uni.showModal({
						title:'提示',
						content:'是否清除缓存?',
						success: (res) => {
							if(res.confirm){
								uni.showToast({
									title:'清除成功'
								});
							}
						}//
					});
					break;
				}
			}
		}
	}
	
</script>
<style scoped>
.handle-list{
	padding: 0 40upx 0 30upx;	
}
.handle-list .handle-list-item{
	display: flex;
	height:80upx;
	align-items: center;
	border-bottom: 1upx solid #eee;
}
.handle-list .handle-list-item .icon-box{
	width: 60upx;
	height: 80upx;
	display: flex;
	align-items: center;
	justify-content: center;
	
}
.handle-list .handle-list-item .icon-box>view{
	font-size: 40upx;
}
.handle-list .handle-list-item .icon-box .icon-lishi{
	font-size: 36upx;
}
.handle-list .handle-list-item .icon-box .icon-btn-check{
	margin-top: -10upx;
	font-size: 42upx;
}
.handle-list .handle-list-item>view:nth-child(1){
	font-size:45upx;
	margin-right: 15upx;	
}
.handle-list .handle-list-item>view:nth-child(2){
	font-size: 28upx;
	flex: 1;
}
.handle-list .handle-list-item>view:nth-child(3){
	font-size: 26upx;
	color: #ccc;
}
.blue{
	color: #007AFF;
}
.red{
	color: #e74c3c;
	font-size: 30upx;
}
.blue1{
	color: #273c75;
}	
	
</style>
