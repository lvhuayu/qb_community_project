<template>
	<view class="load-more">{{loadMoreText}}</view>
</template>

<script>
	export default {
		props:{
			loadMoreText:String
		}
	}
</script>

<style scoped>
.load-more{
	text-align: center;
	font-size: 30upx;
	color: #aaaaaa;
}
</style>
