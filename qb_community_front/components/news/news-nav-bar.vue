<template>
	
	<view>
		
		<!-- 自定义导航栏 -->
		<uni-nav-bar :fixed="true" :statusBar="true" :border="false"  @click-right="release">
			<!-- 左边 -->
			<block slot="left">
				<view class="nav-left">
					<view class="icon iconfont icon-qingkong"></view>
				</view>	
			</block>
			<!-- 中间 -->
			<view class="nav-tab-bar">
				<block v-for="(tab,index) in tabBars" :key="tab.id">
					<view class="tabitem" :class="{'active':tabBarIndex==index}" @tap="changeTab(index)">{{tab.name}}</view>
				</block>
			</view>
			<!-- 右边 -->
			<block slot="right">
				<view class="nav-right">
					<view class="icon iconfont icon-pinglun1"></view>
				</view>
			</block>
		</uni-nav-bar>
		
	</view>
	
</template>

<script >
	import uniNavBar from "../../components/uni-nav-bar/uni-nav-bar.vue";
	export default {
		components:{
			uniNavBar
		},
		props:{
			tabBars:Array,
			tabBarIndex:Number
		},
		methods:{
			changeTab(index){
				this.$emit('change-tab',index)
			},
			release(){
				if(this.User.token){
					uni.navigateTo({url:'../release/release',})
				}else{
					uni.showToast({title: '请先登录~',icon:'none'});
				}
			},
		},
	}
</script>

<style scoped>
.nav-left,.nav-right{
	width: 100%;
}
.nav-left>view,.nav-right>view{
	font-size: 30upx;
	display: flex;
	align-items: center;
	justify-content: center;
}
.nav-left{
	margin-right: 50upx;
	color: #333;
}
.nav-right{
	width: 100%;
}
.nav-right>view{
	font-size: 35upx;
	color: #333;
	margin-left: 15upx;
}
.nav-tab-bar{
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-left: -20upx;
	height: 100%;
}
	
.nav-tab-bar .tabitem{
	margin: 0 10upx;
	font-weight: 700;
	color: #969696;
}
.nav-tab-bar .focus{
	margin: 0 10upx;
}
.nav-tab-bar .active{
	position: relative;
	color: #333333;
}
.nav-tab-bar .active::after{
	position: absolute;
	bottom: 10upx;
	content: '';
	display: block;
	width: 100%;
	height: 10upx;
	border-radius: 7upx;
	background: #FEDE33;
}
</style>
