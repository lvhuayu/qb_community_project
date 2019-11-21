<template>
	<view>
		<view class="friend-list">
			<view class="u-img">
				<image :src="item.uimg" mode="aspectFill"></image>
			</view>
			<view class="u-msg">
				<view class="msg-name">{{item.uname}}</view>
				<view class="msg-age" :class="[item.sex==0?'nan':'nv']">
					<view class="icon iconfont" :class="[item.sex==0?'icon-xingbienanxianxing':'icon-xingbienvxianxing']"></view>
					<view>{{item.age}}</view>
				</view>
			</view>
			<view class="u-icon" v-show="!isHide">
				<view class="icon iconfont " :class="stateClass" @tap.stop="handlePro(item)"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			isHide:{
				type:Boolean,
				default:false
			},
			item:Object,
			index:Number,
			stateClass:String
		},
		methods:{
			//取关
			handlePro(item){
				switch(item.type){
					case 'icon-huguan':
						uni.showModal({
							title:'提示',
							content:'确认取消关注吗?',
							success: (onres) => {
								if(onres.confirm){
									this.escFocus(item.id);
								}	
							}
						});
					break;
					case 'icon-pinglunicon-':
					uni.showModal({
						title:'提示',
						content:'确认取消关注吗?',
						success: (onres) => {
							if(onres.confirm){
								this.escFocus(item.id);
							}	
						}
					});
					break;
					case 'icon-icon-add':
						this.focus(item.id);
					break;
				}
			},
			//取消关注
			async escFocus(id){
				let [err,res] =await this.$http.post('handle/escFollow',{
						user_id:this.User.userinfo.id,
						follow_id:id
					})
				if(!err){
					let data = res.data;
					if(data.code==200){
						uni.showToast({title:'取关成功'})
						let val = {
							type:'escFocus',
							src:this.item.type,
							id:this.item.id
						}
						this.$emit('escFocus',val)
					}else{
						uni.showTabBar({title:'操作失败',icon:'none'})
					}
				}else{
					uni.showTabBar({title:'操作失败',icon:'none'})
				}
			},
			//关注
			async focus(id){
				let [err,res] = await this.$http.post('handle/follow',{
					follow_id:id,
					user_id:this.User.userinfo.id
				})
				if(!err){
					let data = res.data;
					if(data.code==200){
						uni.showToast({title:'关注成功'})
						let val ={
							type:'focus',
							id:this.item.id
						}
						this.$emit('focus',val)
					}else{
						uni.showToast({title:'关注失败',icon:'none'})
					}
				}else{
					uni.showToast({title:'关注失败',icon:'none'})
				}
			},
		}
	}
</script>

<style scoped>
.friend-list{
	padding:15upx 20px;
	border-bottom: 1upx solid #eee;
	display: flex;
	align-items: center;
}
.nv{
	background:#ff4757 ;
}
.nan{
	background: #00a8ff;
}
.friend-list .u-img{
	flex: 20%;
	width: 85upx;
	height: 85upx;
}
.friend-list .u-img image{
	width: 85upx;
	height: 85upx;
	border-radius: 100%;
}
.friend-list .u-msg{
	flex: 80%;
}
.friend-list .u-msg .msg-name{
	font-size: 30upx;
}
.friend-list .u-msg .msg-age{
	margin-top: 5upx;
	display: flex;
	width: 80upx;
	justify-content: center;
	align-items: center;
	border-radius: 30upx;
}
.friend-list .u-msg .msg-age>view{
	margin:0 5upx;
	color: #fff;
	font-size: 21upx;	
}
.friend-list .u-icon>view{
	font-size: 42upx;
	color: #999;
}
.u-icon .icon-pinglunicon-{
	color: #FF0000 !important;
}
.u-icon .icon-icon-add{
	color: #e74c3c !important;
}
.u-icon .icon-huguan{
	color: #e67e22 !important;
}
</style>
