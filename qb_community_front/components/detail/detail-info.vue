<template>
	<view>
		<view class="detail-info">
			<!-- 顶部用户信息 -->
			<view class="info-top">
				<view class="top-img">
					<image :src="detailInfo.userimg" mode="aspectFill"></image>
				</view>
				<view class="top-msg">
					<view class="msg-name">
						<view class="name">{{detailInfo.username}}</view>
						<view class="name-sex" :class="[detailInfo.sex==0?'nan':'nv']">
							<view class="icon iconfont " :class="[detailInfo.sex==0 ? 'icon-xingbienanxianxing':'icon-xingbienvxianxing']"></view>
							<view>{{detailInfo.age}}</view>
						</view>
					</view>
					<view class="msg-time" v-show="detailInfo.infotime">{{detailInfo.infotime}}</view>
				</view>
				<view class="top-focus" v-show="!detailInfo.isFocus"  @tap="onFocus()">
					<view class="icon iconfont icon-guanzhu1"></view>
				</view>
			</view>
			<!-- 内容主题信息 -->
			<view class="info-mid">
				<view class="mid-tit">
					<text>{{detailInfo.content}}</text>
				</view>
				<!-- 图文 -->
				<template v-if="detailInfo.type=='img'">
					<view class="mid-imgs">
						<block v-for="(item,index) in detailInfo.infoImgs" :key="index">
							<view @tap="imgDetail(index)" ><image :src="item" mode="aspectFill" lazy-load></image></view>
						</block>
					</view>
				</template >
				<!-- 视频 -->
				<template v-if="detailInfo.type=='video'">
					<view class="mid-video">
						<image :src="detailInfo.videoImg" mode="widthFix"></image>
						<view class="icon iconfont icon-bofang play-btn"></view>
					</view>
				</template>
			</view>
			<!-- 点赞评论等 -->
			<view class="info-bot">
				<view class="bot-zf">
					<view class="icon iconfont icon-fenxiangdaozhuanfafasongzhiyuanquanxianxing "></view>
					<view class="num">{{detailInfo.sharenum}}</view>
				</view>
				<view class="bot-zan" @tap="onHandle(detailInfo)">
					<view class="icon iconfont icon-dianzan2 " :class="[infonum.index==1 ? 'onup' : '']"></view>
					<view class="num" :class="[infonum.index==1 ? 'onup' : '']"  >{{infonum.upnum}}</view>
				</view>
				<view class="bot-pl">
					<view class="icon iconfont icon-pinglun "></view>
					<view class="num">{{detailInfo.commentnum}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			detailInfo:Object
		},
		data() {
			return {
				isFocus:'',
				infonum:'',
			}
		},
		onReady() {
			this.isFocus = this.detailInfo.isFocus;
			this.infonum = this.detailInfo.infonum;
		},
		methods:{
			//点击关注
			//点击关注
			async onFocus(){
				if(this.User.token){
					let [err,res] =await this.$http.post('handle/follow',{
						follow_id:this.detailInfo.user_id,
						user_id:this.User.userinfo.id
					})
					if(!err){
						let data = res.data;
						if(data.code==200){
							uni.showToast({
								title:"关注成功"
							})
							let resetDate = {
								type:'onFocus',
								user_id:this.detailInfo.user_id,
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
			//顶和踩
			async onHandle(item){
				if(!this.User.userinfo){
					return uni.showToast({title:'请先登录~',icon:'none'})
				}
				if(item.infonum.index==1){
					return uni.showToast({title:'骄傲使人落后~',icon:'none'})
				}
				item.infonum.upnum++;
				let [err,res] = await this.$http.post('handle/supPort',{
					user_id:this.User.userinfo.id,
					post_id:item.id,
					upnum:item.infonum.upnum,
					downnum:item.infonum.downnum,
					type:0
				})
				if(!err){
					let data = res.data;
					if(data.code==200){
						this.detailInfo.infonum.index=1;
						uni.showToast({title:'感谢你的赞~'})	
					}else if(data.code==201){
						uni.showToast({title:'你好像赞过啦~',icon:'none'})
					}
				}else{
					uni.showToast({title:'网络开小差了~',icon:'none'})
				}
			},
			imgDetail(index){
				uni.previewImage({
					urls:this.detailInfo.infoImgs,
					current:index
				})
			},
		}
	}
</script>

<style scoped>
.detail-info{
	padding: 0 20upx;
	background: #fff;
}
.detail-info .info-top{
	display: flex;
	align-items: center;
	position: relative;
}
.detail-info .info-top .top-img image{
	width: 90upx;
	height: 90upx;
	border-radius: 100%;
}
.detail-info .info-top .top-msg{
	margin-left: 20upx;
}

.detail-info .info-top .top-msg .msg-name{
	font-size: 30upx;
	display: flex;
	align-items: center;
}
.detail-info .info-top .top-msg .msg-name .name-sex{
	display: flex;
	align-items: center;
	margin-left: 15upx;
	border-radius: 15upx;
	padding: 0 10upx;
}
.detail-info .info-top .top-msg .msg-name .name-sex>view{
	margin: 0 3upx;
}
.nv{
	background: #ee5253;
}
.nan{
	background: #0abde3;
}
.onup{
	color: #333333 !important;
}
.detail-info .info-top .top-msg .msg-name .name-sex>view{
	font-size: 20upx;
	color: #fff;
}
.detail-info .info-top .top-msg .msg-time{
	font-size: 24upx;
	color: #ccc;
	margin-top: -10upx;
}
.detail-info .info-top .top-focus{
	position: absolute;
	right: 20upx;
	
}
.detail-info .info-top .top-focus>view{
	color: #FF0000;
	font-size: 36upx;
}

.info-mid{
	padding:0 10px;
	margin-bottom: 15upx;
}
.info-mid .mid-tit text{
	font-size: 30upx;
}
.info-mid .mid-imgs{
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
}
.info-mid .mid-imgs>view{
	flex: 50%;
}
.info-mid .mid-imgs image{
	width: 100%;
	height:300upx;
	padding: 15upx 0;
}
.info-mid .mid-video{
	position: relative;
}
.info-mid .mid-video>view{
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%,-50%);
	font-size: 150upx;
	color: #fff;
}
.info-mid .mid-video image{
	border-radius: 15upx;
}
.detail-info .info-bot{
	display: flex;
	align-items: center;
	justify-content: space-around;
	padding: 5upx 20px;
	border-top: 1upx solid #eee;
}
.detail-info .info-bot>view{
	width: 33%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 25upx;
}
.detail-info .info-bot>view>view{
	margin: 0 5upx;
	color: #999;
	display: flex;
	align-items: center;
}
.detail-info .info-bot>view .icon{
	font-size: 30upx;
}
.detail-info .info-bot>view .icon-fenxiangdaozhuanfafasongzhiyuanquanxianxing{
	margin-top: -2upx;
}
.detail-info .info-bot>view .icon-dianzan2{
	margin-top: -5upx;
}
.detail-info .info-bot>view .icon-pinglun {
	margin-top: 5upx;
}
.detail-info .info-bot .num{
	font-size: 28upx;
}	
</style>
