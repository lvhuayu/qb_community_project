<template>
	
	<view class="animated fadeIn fast" v-if="shareShow">
		<view class="more-share-mask"  @tap="toggleShare()"></view>
		<view class="more-share-model">
			<view class="more-share-title">分享到</view>
			<scroll-view scroll-x class="more-share-item">
				<block v-for="(item,index) in providerList" :key="index">
					<view class="item" hover-class="more-share-hover" @tap="share(item)">
						<view class="icon iconfont" :class="['icon-'+item.shareIcon]"></view>
						<view>{{item.name}}</view>
					</view>
				</block>
			</scroll-view>
			<view class="more-share-bottom" hover-class="more-share-hover" @tap="toggleShare">取消</view>
		</view>
		
	</view>
	
</template>

<script>
	export default {
		props:{
			shareShow:Boolean,
			shareDate:Object,
			shares:Object
		},
		data() {
			return {
				title: '',
				shareText:'',
				href:"https://uniapp.dcloud.io",
				image: '',
				shareType:0,// 1文字 2图片 0图文 5小程序
				providerList: [],
			}
		},
		watch:{
			shareDate(newval,oldval){
				this.title = newval.title;
				this.shareText = newval.content
				this.href = newval.url;
				this.image = newval.titlepic;
				this.shareType = newval.shareType;
			}
		},
		onReady () {
			uni.getProvider({
				service: 'share',
				success: (e) => {
					let data = []
					for (let i = 0; i < e.provider.length; i++) {
						switch (e.provider[i]) {
							case 'weixin':
								data.push({
									name: '微信好友',
									id: 'weixin',
									shareIcon:'weixin1',
									sort:0
								})
								data.push({
									name: '朋友圈',
									id: 'weixin',
									type:'WXSenceTimeline',
									shareIcon:'pengyouquan',
									sort:1
								})
								break;
							case 'sinaweibo':
								data.push({
									name: '新浪微博',
									id: 'sinaweibo',
									shareIcon:'weibo',
									sort:2
								})
								break;
							case 'qq':
								data.push({
									name: 'QQ好友',
									id: 'qq',
									shareIcon:'qq1',
									sort:3
								})
								break;
							default:
								break;
						}
					}
					this.providerList = data.sort((x,y) => {
						return x.sort - y.sort
					});
				},
				fail: (e) => {
					console.log('获取分享通道失败', e);
					uni.showModal({
						content:'获取分享通道失败',
						showCancel:false
					})
				}
			});
			
		},
		methods:{
			toggleShare(){
				this.$emit('toggleShare');
			},
			//更新分享数
			async updateShareNum(){
				this.shares.sharenum++
				let [err,res] = await this.$http.post('handle/share',{
					post_id:this.shares.post_id,
					sharenum:this.shares.sharenum
				})
				this.$emit('updateShare',this.shares.sharenum);
			},
			async share(e) {
				console.log('分享通道:'+ e.id +'； 分享类型:' + this.shareType);
				if(!this.shareText && (this.shareType === 1 || this.shareType === 0)){
					uni.showModal({
						content:'分享内容不能为空',
						showCancel:false
					})
					return;
				}
				
				if(!this.image && (this.shareType === 2 || this.shareType === 0)){
					uni.showModal({
						content:'分享图片不能为空',
						showCancel:false
					})
					return;
				}
				
				let shareOPtions = {
					provider: e.id,
					scene: e.type && e.type === 'WXSenceTimeline' ? 'WXSenceTimeline' : 'WXSceneSession', //WXSceneSession”分享到聊天界面，“WXSenceTimeline”分享到朋友圈，“WXSceneFavorite”分享到微信收藏     
					type: this.shareType,
					success: (e) => {
						console.log('success', e);
						this.updateShareNum()
						uni.showModal({
							content: '分享成功',
							showCancel:false
						})
					},
					fail: (e) => {
						console.log('fail', e)
						uni.showModal({
							content: e.errMsg,
							showCancel:false
						})
					},
					complete:function(){
						console.log('分享操作结束!')
					}
				}
				
				switch (this.shareType){
					case 0:
						shareOPtions.summary = this.shareText;
						shareOPtions.imageUrl = this.image;
						shareOPtions.title = this.title;
						shareOPtions.href = this.href;
						break;
					case 1:
						shareOPtions.summary = this.shareText;
						break;
					case 2:
						shareOPtions.imageUrl = this.image;
						break;
					case 5:
						shareOPtions.imageUrl = this.image ? this.image : 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/app/share-logo@3.png'
						shareOPtions.title = this.title;
						shareOPtions.miniProgram = {
							id:'gh_33446d7f7a26',
							path:'/pages/tabBar/component/component',
							webUrl:'https://uniapp.dcloud.io',
							type:0
						};
						break;
					default:
						break;
				}
				
				if(shareOPtions.type === 0 && plus.os.name === 'iOS'){//如果是图文分享，且是ios平台，则压缩图片 
					shareOPtions.imageUrl = await this.compress();
				}
				//如果是微博分享，图片为空，微博不支持图文分享
				if (shareOPtions.provider === 'sinaweibo') {
					shareOPtions.type = 1;
					shareOPtions.imageUrl = '';
				}
				if (shareOPtions.provider === 'qq') {//如果是分享文字到qq，则必须加上href和title
					shareOPtions.type = 1;
					shareOPtions.href = this.href;
					shareOPtions.title = this.title;
					
				}
				 uni.share(shareOPtions);
			},
			//压缩图片
			compress(){//压缩图片 图文分享要求分享图片大小不能超过20Kb
				console.log('开始压缩');
				let img = this.image;
				return new Promise((res) => {
					var localPath = plus.io.convertAbsoluteFileSystem(img.replace('file://', ''));
					console.log('after' + localPath);
					// 压缩size
					plus.io.resolveLocalFileSystemURL(localPath, (entry) => {
						entry.file((file) => {// 可通过entry对象操作图片 
							console.log('getFile:' + JSON.stringify(file));
							if(file.size > 20480) {// 压缩后size 大于20Kb
								plus.zip.compressImage({
									src: img,
									dst: img.replace('.jpg', '2222.jpg').replace('.JPG', '2222.JPG'),
									width: '10%',
									height: '10%',
									quality: 1,
									overwrite: true
								}, (event) => {
									console.log('success zip****' + event.size);
									let newImg = img.replace('.jpg', '2222.jpg').replace('.JPG', '2222.JPG');
									res(newImg);
								}, function(error) {
									uni.showModal({
										content:'分享图片太大,需要请重新选择图片!',
										showCancel:false
									})
								});
							}
						});
					}, (e) => {
						console.log('Resolve file URL failed: ' + e.message);
						uni.showModal({
							content:'分享图片太大,需要请重新选择图片!',
							showCancel:false
						})
					});
				})
			}
			
		}
	}
</script>

<style scoped>
.more-share-mask{
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right:0;
	z-index: 8;
	background: rgba(0,0,0,.3);
}
.more-share-model{
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background: #fff;
	z-index: 9;
}
.more-share-hover{
	background: #eeeee;
}	
.more-share-model .more-share-title{
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32upx;
	padding: 20upx;
}
.more-share-model .more-share-item{
	display: flex;
	justify-content: center;
	align-items: center;
	white-space: nowrap;
	width: 100%;
	height: 170upx;
}
.more-share-model .more-share-item .item{
	width: 25%;
	display:inline-flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}
.more-share-model .more-share-item .item>view:first-child{
	width: 100upx;
	height: 100upx;
	border-radius: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 80upx;	
}
.more-share-model .more-share-item .item:nth-child(1)>view:first-child{
	color: #09BB07;
}
.more-share-model .more-share-item .item:nth-child(2)>view:first-child{
	color: #feca57;
}
.more-share-model .more-share-item .item:nth-child(3)>view:first-child{
	color: #FF0000;
}
.more-share-model .more-share-item .item:nth-child(4)>view:first-child{
	color: #007AFF;
}
.more-share-bottom{
	width: 90%;
	height: 80upx;
	margin: 0 auto;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32upx;
	border-top: 1upx solid #eee;
}	
</style>
