<template>
	
	<!-- 背景图和用户基本信息 -->
	<view class="user-space">
			<image :src="bgimg" mode="aspectFill" lazy-load @tap="changeBgImg()"></image>	
		<view class="user-info-top">
			<view class="info-img">
				<image :src="userInfo.userimg" mode="aspectFill" lazy-load></image>
			</view>
			<view class="info-msg">
				<view class="msg-num">
					<view>
						<view>{{userCount.post_count ? userCount.post_count : 0}}</view>
						<view>动态</view>
					</view>
					<view>
						<view>{{userCount.follow_count ? userCount.follow_count : 0 }}</view>
						<view>关注</view>
					</view>
					<view>
						<view>{{userCount.fans_count ? userCount.fans_count :0}}</view>
						<view>粉丝</view>
					</view>
				</view>
				<view class="msg-focus" 
				:class="[userInfo.isFocus?'msg-focus-in':'']" @tap="onFocus">
				{{userInfo.isFocus ? '已关注' : '关注' }}
				</view>
			</view>
		</view>
	</view>
	
</template>

<script>
	export default {
		props:{
			bgimg:String,
			userInfo:Object,
			userCount:Object,
		},
		data() {
			return {
				user_count:{
					post_count:0,
					follow_count:0,
					fans_count:0
				},
			}
		},
		computed:{
			getBgimg(){
				return `../../static/bgimg/${this.bgimg}.jpg`
			}
		},
		methods:{
			//关注
			async onFocus(){
				if(this.userInfo.isFocus) return uni.showToast({ title:'已关注',icon:'none' })
				let [err,res] =await this.$http.post('handle/follow',{
					follow_id:this.userInfo.id,
					user_id:this.User.userinfo.id
				})
				if(!err){
					let data = res.data;
					if(data.code==200){
						this.$emit('focus')
						uni.showToast({ title:'关注成功'})
					}else{
						uni.showToast({ title:'关注失败',icon:'none' })
					}
				}else{
					uni.showToast({ title:'关注失败',icon:'none' })
				}
			},
		}
	}
	
</script>

<style scoped>
.user-space{
	height: 470upx;
	position: relative;
	overflow: hidden;
}
.user-space image{
	width: 100%;
	height: 100%;
	z-index: 7;
}
.user-info-top{
	width: 100%;
	padding: 0 60upx;
	position: absolute;
	display: flex;
	top: 50%;
	transform: translateY(-30%);
	z-index: 99;
}
.user-space .user-info-top .info-img{
	width: 200upx;
	height: 200upx;
	margin-right: 40upx;
} 
.user-info-top .info-img image{
	width: 200upx;
	height: 200upx;
	border-radius: 100%;
	filter: none !important;
}
.user-info-top .info-msg .msg-num{
	display: flex;
	justify-content: space-between;
}
.user-info-top .info-msg .msg-num>view{
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin: 0 30upx;
}
.user-info-top .info-msg .msg-num>view>view:first-child{
	font-size: 44upx;
	font-weight: 700;
	color: #fff;
}
.user-info-top .info-msg .msg-num>view>view:last-child{
	font-size: 30upx;
	font-weight: 700;
	color: #fff;
	margin-top: -10upx;
}
.user-info-top .info-msg .msg-focus{
	width: 100%;
	margin-top: 10upx;
	height: 70upx;
	text-align: center;
	line-height: 70upx;
	font-size: 35upx;
	color: #fff;
	background:#fede33;
	border-radius: 4upx;
	font-weight: bold;
}
.user-info-top .info-msg .msg-focus-in{
	background: #fff;
	color: #333;
}	
	
	
</style>
