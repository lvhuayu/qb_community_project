<template>
	<view style="overflow: hidden;">
		<!-- 自定义导航栏 -->
		<uni-nav-bar :statusBar="true" rightText="发布" left-icon="back"  @click-left="back" @click-right="release">
			<view class="tit" @tap="postStatus">
				 {{articleStatus}}
				<view class="icon iconfont icon-arrow"></view>
			</view>
		</uni-nav-bar>
		<!-- 输入框 -->
		<view class="post-title">
			<input type="text" v-model="title" placeholder="为你的文章起个标题吧" />
		</view>
		<view class="uni-textarea">
		<textarea value="" placeholder="快来说点什么吧~" v-model="nuiTextarea" />
		</view>
		<!-- 多图上传 -->
		<upload-images @upload="upload" :image-list="imgList" @del='delImageList'></upload-images>
		<!-- 弹出公告 -->
		<uni-popup :show="showPopup" position="middle" mode="fixed" @hidePopup="hidePopup">
			<view class="prompt">
				<view class="pro-img">
				<image src="../../static/common/addinput.png" mode="widthFix"></image>
				</view>
				<view class="pro-msg">
					<view class="msg">1、涉及黄色、政治、广告及骚扰信息。</view>
					<view class="msg">2、涉及人身攻击。</view>
					<view class="msg">3、留联系方式，透漏他人隐私。</view>
					<view class="msg">一经核实将被封禁，情节严重者永久封禁。</view>
				</view>
				<button type="default" @tap="hidePopup()">朕知道了</button>
			</view>
		</uni-popup>
		<!-- 底部选项卡 -->
		<view class="class-selectdor">
			<picker class="class-picker" mode="selector" :range="postClass.range" @change="changePostClass">
				<view class="picker-item">
				{{postClass.title ? postClass.title : "选择分类"}}
				</view>
			</picker>
			<view class="topic-selectdor"
			hover-class="addinput-foot-btn"
			@tap="changeTopic">{{topic.title ? topic.title : "选择话题"}}</view>
		</view>
	</view>
</template>

<script>
	import uniNavBar from "../../components/uni-nav-bar/uni-nav-bar.vue";
	import uploadImages from "../../components/common/upload-images.vue";
	import uniPopup  from "../../components/uni-popup/uni-popup.vue";
	export default {
		components:{
			uniNavBar,
			uploadImages,
			uniPopup
		},
		data() {
			return {
				flag:false,
				articleStatus:"所有人可见",
				itemList:['仅自己可见','所有人可见'],
				title:'',
				nuiTextarea:'',
				isopen:0,
				imgList:[],
				imgIds:[],
				showPopup:true,
				postClass:{
					id:0,//当前选中分类的Id
					title:'',//当前选中的分类名称
					range:[],//可选项
					list:[]//服务端获取的分类列表
				},
				topic:{
					id:0,
					title:'',
				}
			}
		},
		onBackPress() {
			//如果文本框有值
			if(!this.nuiTextarea && this.imgList.length<1){ return; }
			if(!this.flag){
				this.saveInner();
				return true;
			}
		},
		onLoad(e) {
			//读取保存的草稿
			let tempArticle = uni.getStorageSync('tempArticle');
			if(tempArticle){
				tempArticle = JSON.parse(tempArticle)
				this.articleStatus = this.itemList[tempArticle.isopen] || '所有人可见';
				this.imgIds = tempArticle.imgIds;
				if(this.imgIds.length){
					this.imgList = tempArticle.imgList
				}
				this.title = tempArticle.title;
				this.nuiTextarea = tempArticle.nuiTextarea;
				if(tempArticle.postClass){
					this.postClass = tempArticle.postClass;
				}
				if(tempArticle.topic){
					this.topic = tempArticle.topic;
				}
				
			}
			let post = e.postClass ? JSON.parse(e.postClass) : false;
			this.getPostClass(post)
			//获取选取的话题
			uni.$on('changeTopic',(data)=>{
				this.topic.id=data.id,
				this.topic.title=data.title
			})
		},
		methods: {
			//返回
			back(){
				uni.navigateBack({
					delta:1,
				})
			},
			//发布
			async release(){
				if(!this.postClass.id){
					return uni.showToast({title:'请选择文章分类',icon:'none'});
				}else{
					 uni.showLoading({title:'发布中...',mask:true});
					let [err,res] = await this.$http.post('user/create',{
						user_id:this.User.userinfo.id,
						title:this.title,
						text:this.nuiTextarea,
						openType:this.isopen,
						topic_id:this.topic.id,
						path:this.User.userinfo.userinfo.path || '中国',
						post_class_id:this.postClass.id,
						imglist_id:JSON.stringify(this.imgIds)
					})
					if(!err){
						let data = res.data;
						if(data.code==200){
							uni.showToast({
								title:'发布成功~',
								icon:'none'
							})
							this.flag = true;
							uni.hideLoading();
							uni.navigateBack({ delta: 1 });
						}else{
							uni.showToast({
								title:'发布失败~',
								icon:'none'
							})
							uni.hideLoading()
						}
					}else{
						uni.showToast({
							title:'发布失败~',
							icon:'none'
						})
						uni.hideLoading()
					}
				}
			},
			//修改发布文章状态
			postStatus(){
				uni.showActionSheet({
					itemList:this.itemList,
					success:(res)=> {
						this.articleStatus = this.itemList[res.tapIndex];
					}
				})
			},
			//保存为草稿
			saveInner(){
				uni.showModal({
					content:'是否保存为草稿',
					cancelText:'不保存',
					confirmText:'保存',
					success: (res) => {
						if(res.confirm){
							//保存到草稿
							let tempArticle ={
								isopen:this.itemList.indexOf(this.articleStatus),
								title:this.title,
								nuiTextarea:this.nuiTextarea,
								imgList:this.imgList,
								imgIds:this.imgIds,
								postClass:this.postClass,
								topic:this.topic
							}
							uni.setStorageSync('tempArticle',JSON.stringify(tempArticle))
						}else{
							//不保存清除缓存
							uni.removeStorage({key:'tempArticle'})
						}
						this.flag = true;
						uni.navigateBack({
							delta:1
						});
					}
				})
			},
			//获取上传图片信息
			upload(val){
				let item = JSON.parse(val);
				this.imgList.push(item.url);
				this.imgIds.push({id:item.id});
			},
			//删除图片
			delImageList(index){
				this.imgList.splice(index,1);
				this.imgIds.splice(index,1);
			},
			hidePopup(){
				this.showPopup = false;
			},
			//获取分类
			async getPostClass(postClass){
				if(postClass){
					this.postClass.list = postClass;
					for(var item of postClass){
						this.postClass.range.push(item.name)
					}
				}else{
					let [err,res] =await this.$http.get('index/getClass');
					if(err){
						uni.showToast({
							title:'网络开小差了',
							icon:'none'
						})
					}
					let data = res.data;
					if(data.code==200 && data.data){
						for(var item of data.data.list){
							this.postClass.range.push(item.classname);
							this.postClass.list.push({
								id:item.id,
								name:item.classname
							})
						}
					}else{
						uni.showToast({
							title:'网络错误',
							icon:'none'
						})
					}
				}
			},
			//改变选项
			changePostClass(e){
				// 当前选中的id
				this.postClass.id = this.postClass.list[e.target.value].id;
				// 当前选中的名称
				this.postClass.title = this.postClass.list[e.target.value].name;
			},
			//选择话题
			changeTopic(){
				uni.navigateTo({
					url:'../topic-nav/topic-nav?isChange='+true
				});
			},
		}
	}
</script>

<style>
.tit{
	display: flex;
	justify-content: center;
	align-items: center;
}
.post-title{
	margin-top: 10upx;
	height: 60upx;
	padding-left: 10upx;
}
.uni-textarea{
	border: 1upx solid #eee;
}
.prompt{
	width: 600upx;
	padding: 10upx 0;
}
.prompt .pro-img{
	display: flex;
	align-items: center;
	justify-content: center;
}
.pro-img image{
	width: 60%;
	margin-bottom: 20upx;
}
.prompt .pro-msg{
	padding: 0 20upx;
}
.prompt .pro-msg .msg{
	margin: 7upx 0;
}
.prompt button{
	margin-top: 20upx;
	background: #ffe934;
	color: #171606;
}
.class-selectdor{
	display: flex;
	justify-content: space-around;
	align-items: center;
	background: #FFFFFF;
	position: fixed;bottom: 0;
	left: 0;
	right: 0;
	height: 88upx;
	border-top:1upx solid #DDDDDD;
}
.addinput-foot-btn .class-picker{
	display: flex;
	align-items: center;
	justify-content: center;
}
.addinput-foot-btn .class-picker .picker-item{
	display: flex;
	align-items: center;
	justify-content: center;
}
.topic-selectdor{
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
