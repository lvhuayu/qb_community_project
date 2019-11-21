<template>
	<!-- 顶部选项卡 -->
	<view class="uni-tab-bar">
		<scroll-view scroll-x class="uni-swiper-tab" :style="scrollStyle">
			<block v-for="(tab,index) in tabBars" :key="index">
				<view class="swiper-tab-list" 
				:class="{'active':tabIndex===index}"
				@tap="tabTap(index)" :style="scrollItemStyle">
					{{tab.name}} {{tab.num?tab.num:''}}
					<view class="swiper-tab-line"></view>
				</view>
			</block>
		</scroll-view>
	</view>	
</template>

<script>
	export default {
		props:{
			tabBars:Array,
			tabIndex:Number,
			scrollStyle:{
				type:String,
				default:""
			},
			scrollItemStyle:{
				type:String,
				default:""
			}
		},
		methods:{
			tabTap(index){
				this.$emit('tabtap',index)
			},
		},
	}
</script>

<style scoped>
.swiper-tab-list{
	color: #969696;
	font-weight: bold;
}
.uni-swiper-tab{
	border-bottom: 1upx solid #EEEEEE;
}
.uni-swiper-tab .active{
	color: #343434;
	font-size: 32upx;
}
.active .swiper-tab-line{
	width: 75upx;
	height: 10upx;
	background:#fede33 ;
	margin: auto;
	border-radius: 20upx;
}
</style>
