<template>
	<view class="base-menu">
		<block v-for="(item,index) in baseData" :key="index">
			<view>
				<view>{{item.num}}</view>
				<view>{{item.name}}</view>
			</view>
		</block>
	</view>
</template>

<script>
	
	export default {
		props:{
			baseData:Array
		}
	}
	
</script>

<style scoped>
.base-menu{
	width: 75%;
	margin: 0 auto;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.base-menu>view{
	display: flex;
	flex-direction: column;
	align-items: center;
}
.base-menu>view>view:first-child{
	font-size: 32upx;
	color: #333;
}
.base-menu>view>view:last-child{
	color: #ccc;
}	
</style>
