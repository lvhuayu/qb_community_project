<template>
	<view class="card-list animated fadeIn" >
		<!-- 用户信息，头像昵称关注 -->
		<view class="card-msg">
			<!-- 用户头像昵称 -->
			<view class="msg-user">
				<image :src="item.uimg" lazy-load></image>
				{{item.uname}}
			</view>
			<!-- 关注按钮 -->
			<view class="msg-focus" v-show="!item.isFocus" @tap="onFocus()">
				<view class="icon iconfont icon-guanzhu1" style="margin-right: 15upx;"></view>
			</view>
		</view>
		<!-- 标题 -->
		<view class="card-tit" @tap="goDetail()" >{{item.title}}</view>
		<!-- 标题图片 -->
		<view class="card-img" v-show="item.titimg" @tap="goDetail()" >
			<image :src="item.titimg"  mode="widthFix" lazy-load></image>
		</view>
		<!-- 图文底部操作 -->
		<view class="card-handle">
			<!-- 顶和踩 -->
			<view class="handle-click">
				<view class="c-up" @tap="onHandle('up',item.id)">
					<view class="icon iconfont icon-dianzan2" :class="{'active':infonum.index==1}"
					 ></view>
					 <view class="icon-txt">{{infonum.upnum}}</view>
				</view>
				<view class="c-down" @tap="onHandle('down',item.id)">
					<view class="icon iconfont icon-dianzan1" :class="{'active':infonum.index==2}"
					></view>
					<view class="icon-txt">{{infonum.downnum}}</view>
				</view>
			</view>
			<!-- 评论和转发 -->
			<view class="handle-forward">
				<view>
					<view class="icon iconfont icon-pinglun"></view>
					<view class="icon-txt">{{item.commentnum}}</view>
				</view>
				<view>
					<view class="icon iconfont  icon-fenxiangdaozhuanfafasongzhiyuanquanxianxing"></view>
					<view class="icon-txt">{{item.sharenum}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			item: Object,//父组件传来的每一个对象
			index: Number,//对象索引
		},
		data(){
			return{
				isFocus:this.item.isFocus,
				infonum:this.item.infonum
			}
		},
		methods: {
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
			//顶和踩
			async onHandle(type,id){
				if(!this.User.userinfo){
					return uni.showToast({title:'请先登录~',icon:'none'})
				}
				switch(type){
					case 'up':
					if(this.infonum.index==1){ return;};
					this.infonum.upnum++;
					if(this.infonum.index==2){
						if(this.infonum.downnum==0) return
						this.infonum.downnum--;
					}
					this.infonum.index=1;
					let [err,res] = await this.$http.post('handle/supPort',{
						user_id:this.User.userinfo.id,
						post_id:id,
						upnum:this.infonum.upnum,
						downnum:this.infonum.downnum,
						type:0
					})
					if(!err){
						let data = res.data;
						if(data.code==200){
							uni.showToast({title:'感谢你的赞~'})	
						}else if(data.code==201){
							uni.showToast({title:'你好像赞过啦~',icon:'none'})
						}
					}else{
						uni.showToast({title:'网络开小差了~',icon:'none'})
					}
					break;
					case 'down':
					if(this.infonum.index==2){ return;};
					this.infonum.downnum++;
					if(this.infonum.index==1){
						if(this.infonum.upnum==0)return
						this.infonum.upnum--;
					}
					this.infonum.index=2;
					let [err1,res1] = await this.$http.post('handle/supPort',{
						user_id:this.User.userinfo.id,
						post_id:id,
						upnum:this.infonum.upnum,
						downnum:this.infonum.downnum,
						type:1
					})
					if(!err1){
						let data = res1.data;
						if(data.code==200){
							uni.showToast({title:'作者会改进哒~'})	
						}else if(data.code==201){
							uni.showToast({title:'你好像已经踩过啦~',icon:'none'})
						}
					}else{
						uni.showToast({title:'网络开小差了~',icon:'none'})
					}
					break;
				}
			},
		}
	}
</script>

<style scoped>
.card-list {
	padding: 12upx 20upx;
	margin-bottom: 30upx;
}
.card-msg {
	display: flex;
	height: 70upx;
	align-items: center;
	justify-content: space-between;
}

.msg-user {
	display: flex;
	align-items: center;
	font-size: 26upx;
	font-weight: bold;
}

.msg-user image {
	width: 70upx;
	height: 70upx;
	border-radius: 100%;
	overflow: hidden;
	margin-right: 20upx;
	font-weight: bold;
	color: #333;
}

.msg-focus view {
	padding: 0 10upx;
	color: #f00;
	font-size: 35upx;
	padding-right: 20upx;
}

.card-tit {
	margin: 10upx 0;
	padding-left: 15upx;
	font-size: 28upx;
	font-weight: 700;
	color: #333;
}

.card-img image {
	width: 100%;
	height: 100%;
}

.card-handle {
	display: flex;
	align-items: center;
	height: 60upx;
	justify-content: space-between;
	margin-top: 5upx;
	border: 1upx solid #eee;
	border-radius: 10upx;
}
.card-handle .handle-click,
.card-handle .handle-forward{
	width: 50%;
	display: flex;
	align-items: center;
	justify-content: space-around;
}
.card-handle .handle-click>view,
.card-handle .handle-forward>view{
	display: flex;
	justify-content:center;
}
.card-handle .handle-click>view .icon-dianzan2{
	margin-top: -7upx;
}
.card-handle .handle-click>view .icon-dianzan1{
	margin-top: 2upx;
}
.card-handle .handle-click view {
	display: flex;
	align-items: center;
	margin: 0 10upx;
	color: #ccc;
}

.card-handle .handle-click view .active {
	color: #007AFF;
}

.card-handle .handle-forward view {
	display: flex;
	align-items: center;
	margin: 0 10upx;
	color: #ccc;
}
</style>
