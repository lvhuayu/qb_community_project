<template>
	<view >
		<!-- 蒙版 -->
		<view class="handle-mask" v-show="handleShow" @tap="hideHandle"></view>
		<view class="paper-handle-r" v-show="handleShow">
			<view class="r-add" @tap="addFirend">
				<view class="icon iconfont icon-icon-add"></view>
				<view>加糗友</view>
			</view>
			<view class="r-clear" @tap="clearNoRead">
				<view class="icon iconfont icon-qingkong"></view>
				<view>清除未读</view>	
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			handleShow:Boolean
		},
		methods:{
			hideHandle(){
				this.$emit('hideHandle');
			},
			addFirend(){
				this.$emit('addFirend');
			},
			clearNoRead(){
				this.$emit('clearNoRead');
			},
		}
	}
</script>

<style scoped>

.handle-mask{
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 8;
}
.paper-handle-r{
	position: absolute;
	right: 10upx;
	margin-top: 5upx;
	width: 240upx;
	background: #fff;
	box-shadow: 1upx 1upx 20upx 2upx #ccc;
	z-index: 9;
	
}
.paper-handle-r>view{
	display: flex;
	align-items: center;
	padding: 5upx 15upx;
}
.paper-handle-r>view>view{
	height: 60upx;
	line-height: 60upx;
	margin-left: 10upx;
	font-size: 32upx;
}	
	
</style>
