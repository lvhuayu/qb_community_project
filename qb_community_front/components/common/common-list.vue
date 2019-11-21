<template>
	<view class="common-list animated fadeIn">
		<view class="common-list-top" >
			<view class="list-user">
				<view class="user-img">
					<image :src="item.userimg" lazy-load></image>
				</view>
				<view class="user-name">
					{{item.username}}
				</view>
				<view class="user-sex">
					<view class="icon iconfont " :class="[item.sex==0 ? 'icon-xingbienan':'icon-xingbienvxianxing nv']"></view>
				</view>
			</view>
			<view class="list-focus" v-show="!item.isFocus" @tap="onFocus">
				<view class="icon iconfont icon-guanzhu1"></view>
			</view>
		</view>
		<view class="common-list-mid" @tap.stop="goDetail">
			<view class="mid-tit">{{item.title}}</view>
			<view class="mid-showimg">
				<image v-if="item.titleimg" :src="item.titleimg" mode="widthFix" lazy-load></image>
				<!-- 如果是视频显示播放按钮 -->
				<template v-if="item.video">
					<!-- 播放按钮 -->
					<view class="img-play icon iconfont icon-bofang" ></view>
					<!-- 视频时长 -->
					<view class="img-playmsg" >{{item.video.looknum}}次播放&nbsp;&nbsp;{{item.video.long}}</view>
				</template>
			</view>
		</view>
		<view class="common-list-bot">
			<view class="bot-add">
				{{item.path? item.path :'中国'}}
			</view>
			<view class="bot-handle">
				<view class="handle-zf">
					<view class="hz-icon">
						<view class="icon iconfont icon-fenxiangdaozhuanfafasongzhiyuanquanxianxing"></view>
					</view>
					<view class="hz-txt">{{item.sharenum}}</view>	
				</view>
				<view class="handle-pl">
					<view class="hp-icon">
						<view class="icon iconfont icon-pinglun"></view>
					</view>
					<view class="hp-txt">{{item.commentnum}}</view>
				</view>
				<view class="handle-dz">
					<view class="hd-icon">
						<view class="icon iconfont icon-dianzan2"></view>
					</view>
					<view class="hd-txt">{{item.upnum}}</view>
				</view>
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
		data() {
			return {
				isFocus:this.item.isFocus,
			}
		},
		methods:{
			//去详情页
			goDetail(){
				uni.navigateTo({
					url:'../../pages/detail/detail?detailData='+JSON.stringify(this.item),
				})
			},
			//点击关注
			async onFocus(){
				if(this.User.token){
					let [err,res] =await this.$http.post('handle/follow',{
						follow_id:this.item.user_id,
						user_id:this.User.userinfo.id
					})
					if(!err){
						let data = res.data;
						if(data.code==200){
							uni.showToast({
								title:"关注成功",
							})
							let resetDate = {
								type:'onFocus',
								user_id:this.item.user_id,
								data:true
							}
							//通知父组件修改数据状态
							this.$emit('updateEvent',resetDate);
							//通知首页修改数据状态
							uni.$emit('updateData',resetDate)
						}else{
							uni.showToast({
								title:'关注失败',
								icon:'none'
							})
						}
					}else{
						uni.showToast({
							title:'关注失败',
							icon:'none'
						})
					}
				}else{
					uni.showToast({
						title:'请先登录~',
						icon:'none'
					})
				}
			},
		},
	}
	
</script>

<style scoped>
/* 公共列表 */
.common-list{
	margin:10upx 0 20upx 0;
	padding: 10upx 20upx;
	background: #fff;
}
.common-list .common-list-top{
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.common-list .list-user{
	height: 80upx;
	display: flex;
	align-items: center;
}
.common-list .list-user .msg-user{
	display: flex;
	align-items: center;
}
.common-list .list-user .user-img{
	width: 70upx;
	height: 70upx;
	overflow: hidden;
	border-radius: 100%;
	margin-right: 20upx;
}
.common-list .list-user .user-name{
	color: #999;
}
 .user-img image{
	width: 70upx;
	height: 70upx;
}
.common-list .list-user .user-sex{
	margin-left: 20upx;
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: -10upx;
}
.common-list .list-user .user-sex>view{
	padding: 0 20upx;
	font-size: 22upx;
	margin-top:5upx;
	border-radius: 18upx;
	background: #007AFF;
}
.common-list .list-user .user-sex .nv{
	background:#fd79a8;
}
.common-list .list-focus{
	color: #FF0000;
	margin-right: 20upx;
}
.common-list .list-focus>view{
	font-size: 38upx;
}
.common-list .common-list-mid {
	margin-bottom: 15upx;
}
.common-list .common-list-mid .mid-tit{
	padding: 10upx;
	color: #171606;
	font-weight: 700;
}
	
.common-list .common-list-mid .mid-showimg{
	width: 100%;
	border-radius: 15upx;
	overflow: hidden;
	display: flex;
	position: relative;
}
.common-list .common-list-mid .mid-showimg .img-play{
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%,-50%);
	font-size: 120upx;
	color: #fff;
}
.common-list .common-list-mid .mid-showimg .img-playmsg{
	position: absolute;
	bottom: 3%;
	right: 3%;
	font-size: 23upx;
	padding: 3upx 14upx;
	background: rgba(0,0,0,.5);
	color: #fff;
	border-radius: 30upx;
	text-align: center;
	
}
.common-list .common-list-mid .mid-showimg image{
	width: 100%;
	height: 100%;
}
.common-list .common-list-bot .bot-add{
	background: #eee;
	display: inline;
	font-size: 25upx;
	padding: 10upx;
	border-radius: 5upx;
	color: #999;
}
.common-list .common-list-bot .bot-handle{
	margin-top: 15upx;
	height: 55upx;
	border: 1upx solid #eee;
	border-radius: 5upx;
	display: flex;
	align-items: center;
	justify-content: space-around;
}

.common-list .common-list-bot .bot-handle>view{
	width: 30%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 30upx;
	color: #999;
}
.common-list .common-list-bot .bot-handle>view .icon-dianzan2{
	margin-top: -6upx;
} 
.common-list .common-list-bot .bot-handle>view>view{
	height: 100%;
	width: 35upx;
	font-size: 28upx;
	display: flex;
	justify-content: center;
	align-items: center;
}

</style>
