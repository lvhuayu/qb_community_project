<template>
	<view>
		<!-- 详情页信息 -->
		<detail-info :detailInfo="detailInfo" @updateEvent="updateDate"></detail-info>
		
		<!-- 评论组件 -->
		<comment-list :commentData="commentData" @replyComment="replyComment" ></comment-list>
		
		<!-- 占位符 -->
		<view style="height: 120upx;"></view>
		
		<!-- 底部输入框 -->
		<user-chat-bottom  @sendText="sendText" :focus="focus" @blur="blur" ></user-chat-bottom>
		
		<!-- 分享组件 -->
		<moreShare :shareShow="shareShow" @toggleShare="toggleShare"
		 :shareDate="shareDate"
		 @updateShare="updateShare"
		  :shares="shares"></moreShare>
	</view>
</template>

<script>
	import detailInfo from "../../components/detail/detail-info.vue";
	import commentList from "../../components/detail/comment-list.vue";
	import userChatBottom from "../../components/user-chat/user-chat-bottom.vue";
	import moreShare from "../../components/common/more-share.vue";
	import time from "../../common/time.js";
	export default {
		components:{
			detailInfo,
			commentList,
			userChatBottom,
			moreShare
		},
		data() {
			return {
				shareShow:false,
				commentData:{
					count:0,
					list:[]
				},
				shareDate:{
					title:'',
					url:'',
					titlepic:'',
					shareType:0,
				},
				shares:'',
				detailInfo:'',
				focus:false,
				reply_id:0,
			}
		},
		onLoad(e) {
			this.initData(JSON.parse(e.detailData));
			this.initShareDate(JSON.parse(e.detailData))
			this.getComment();
		},
		//监听导航栏按钮事件
		onNavigationBarButtonTap(e) {
			if(e.index==0){
				this.toggleShare();
			}
		},
		methods: {
			//初始化分享内容
			initShareDate(item){
				this.shareDate = {
					title:item.title,
					content:item.content,
					url:'https://codelin.site/',
					titlepic:item.titimg,
					shareType:0
				}
				this.shares = {
					post_id:item.id,
					sharenum:item.sharenum,
				}
			},
			//初始化数据
			initData(val){
				//修改窗口标题
				uni.setNavigationBarTitle({ title:val.title });
				uni.showLoading({
					title:'Loading...',
					mask:true
				});
				this.detailInfo ={
					id:val.id,
					username:val.uname || val.username,
					user_id:val.user_id,
					userimg:val.uimg || val.userimg,
					infotime:val.create_time, 
					isFocus:val.isFocus,
					content:val.content,
					age:val.age,
					sex:val.sex,
					path:val.path,
					type:'img',
					infonum:val.infonum,
					commentnum:val.commentnum,
					sharenum:val.sharenum,
					infoImgs:[]
				}
				this.getPost(val.id);
				this.getComment(this.detailInfo.id)
			},
			//获取文章详情
			async getPost(id){
				let url =`index/post?id=${id}`;
				let [err,res] = await this.$http.get(url);
				let data = res.data
				if(data.code==200){
				 	let post = data.data[0];
					for(var item of post.imgList){
						this.detailInfo.infoImgs.push(item.url);
					}
					uni.hideLoading();
				}else{
					uni.showToast({
						title:'网络开小差啦~',
						icon:'none'
					})
				}
				
			},
			//获取评论
			async getComment(id){
				let url = `index/getComment?post_id=${id}`;
				let [err,res] =await this.$http.get(url);
				if(!err){
					let data = res.data;
					if(data.code==200){
						this.commentData.count = data.data.length;
						this.commentData.list = this.commentData.list.concat(this.__ArrSort(data.data));
					}
				}else{
					return;
				}
			},
			//无限级分类
			__ArrSort(arr,id = 0){
				var temp = [],lev=0;
				var forFn = function(arr, id,lev){
					for (var i = 0; i < arr.length; i++) {
						var item = arr[i];
						if (item.fid==id) {
							item.lev=lev;
							temp.push({
								id:item.id,
								fid:item.fid,
								userimg:item.user.userpic,
								username:item.user.username,
								time:time.gettime.gettime(item.create_time),
								data:item.data,
							});
							forFn(arr,item.id,lev+1);
						}
					}
				};
				forFn(arr, id,lev);
				return temp;
			},
			//发送评论
			async sendText(data){
				if(!this.User.userinfo){
					uni.showToast({title:'登录后才能评论',icon:'none'})
					return ;
				}
				let reply_id = this.reply_id;
				uni.showLoading({title:'评论中...',mask:false})
				let url = `handle/comment`;
				let obj = {
					user_id:this.User.userinfo.id,
					fid:reply_id,//默认0为一级评论
					data:data,
					post_id:this.detailInfo.id,
				}
				let [err,res] =await this.$http.post(url,obj);
				if(!err){
					let datas = res.data;
					if(datas.code==200){
						uni.showToast({title:'评论成功'});
						uni.hideLoading();
						let result = {
							id:datas.data,
							fid:reply_id,
							userimg:this.User.userinfo.userpic,
							username:this.User.userinfo.username,
							time:time.gettime.gettime(new Date().getTime()),
							data:data,
						};
						// 评论数+1
						this.commentData.count++;
						this.detailInfo.commentnum++;
						// 一级评论
						if (reply_id === 0) {
							return this.commentData.list.push(result);
						}
						// 二级评论
						// 找出被评论id的索引
						let index = this.commentData.list.findIndex((val)=>{
							return val.id === reply_id;
						});
						if (index > -1) {
							// 中间插入
							this.commentData.list.splice(index+1,0,result);
						}
					}
				}else{
					uni.showToast({
						title:'评论失败~',
						icon:'none'
					})
				}
			},
			replyComment(item){
				this.focus = true;
				this.reply_id = item.id;
			},
			toggleShare(){
				this.shareShow = ! this.shareShow;
			},
			//修改关注数据
			updateDate(data){
				switch (data.type){
					case 'onFocus':
					this.updateFocus(data)	
					break;
				}
			},
			//更新关注状态
			updateFocus(data){
				this.detailInfo.isFocus = data.data
			},
			//更新分享数
			updateShare(sharenum){
				this.detailInfo.sharenum = sharenum
			},
			//输入框失去焦点
			blur(){
				this.focus = false;
				this.reply_id = 0;
			}
		}
	}
</script>

<style>
page{
	background: #f4f4f4;
}
</style>
