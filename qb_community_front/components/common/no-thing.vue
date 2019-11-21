<template>
	<!-- 无内容默认 -->
	<view class="noting animated bounceIn" >
		<image src="../../static/common/nothing.png" mode="widthFix"></image>
	</view>
</template>

<script>
	export default {
		
	}
	
</script>

<style scoped>
.noting{
	display: flex;
	align-items: center;
	justify-content: center;
	background: #FFFFFF;
	position: absolute;
	top: -120upx;
	left: 0;
	right: 0;
	bottom: 0;
}
.noting image{
	width: 30%;
	height: 25%;
}
</style>
