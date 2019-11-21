<template>
	<view>
		<!-- 操作菜单 -->
		<view class="user-space-menu" v-if="menuShow">
			<view class="menu-blackl" @tap="blackList()">
				<view class="icon iconfont icon-lahei"></view>
				<view>加入黑名单</view>
			</view>
			<view class="menu-addmsg" @tap="sendMsg()">
				<view class="icon iconfont icon-pinglun"></view>
				<view>发消息</view>
			</view>
		</view>
		<!-- 背景图和用户基本信息 -->
		<user-space-head :userInfo="userInfo" :userCount="userCount" :bgimg="img" @focus="focus"></user-space-head>
		<!-- tab导航栏 -->
		<view class="user-space-tabbar">
			<!-- 话题详情切换 -->
			<swiper-tab-head :tabBars="tabBars" :tabIndex="tabIndex" @tabtap="tabtap" 
			scrollStyle="border-bottom:0;background:#fff;" scrollItemStyle="width:50%">
			</swiper-tab-head>
		</view>
		<!-- 基础信息统计 -->
		<view class="user-space-data">
			<!-- 主页信息 -->
			<block v-for="(item,index) in tabList" :key="index">
				<template v-if="tabIndex==index">
					<!-- 列表 -->
					<block v-for="(list,listIndex) in item.list" :key="listIndex">
						<!-- 用户个人信息 -->
						<template v-if="tabIndex==0">
							<view class="user-space-msg">
								<view class="msg-account">
									<view class="tit">账号信息</view>
									<view class="fz">糗龄：{{list.appAge}}</view>
									<view class="fz">糗百ID：{{list.appID}}</view>
								</view>
								<view class="msg-self">
									<view class="tit">个人信息</view>
									<view class="fz">星座：{{list.selfXz}}</view>
									<view class="fz">职业：{{list.selfZy}}</view>
									<view class="fz">家乡：{{list.selfHome}}</view>
									<view class="fz">情感状态：{{list.selfLove}}</view>
								</view>
							</view>
						</template>
						<!-- 帖子动态信息 -->
						<template v-else>
							<common-list :item="list" :index="listIndex" @updateEvent="updateDate"></common-list>
						</template>
					</block>
					<!-- 上拉加载 -->
					<load-more :loadMoreText="item.loadMoreText"></load-more>
				</template>
			</block>
		</view>
		<!-- 遮罩层 -->
		<view class="user-mask" v-if="menuShow" @tap="togleMenuShow"></view>
	</view>	
</template>

<script>
import userSpaceHead from "../../components/user-space/user-space-head.vue";
import swiperTabHead from "../../components/index/swiper-tab-head.vue";
import commonList from "../../components/common/common-list.vue";
import loadMore from "../../components/common/load-more.vue";
import time from "../../common/time.js";
let qg = ['保密','单身','已婚'];
let sex = ['男', '女','不限'];
let emon = ['单身贵族', '恋爱', '已婚'];
let job = ['秘密', 'IT', '金融','管理'];
let bgimg = [
	'../../static/bgimg/1.jpg',
	'../../static/bgimg/2.jpg',
	'../../static/bgimg/3.jpg',
	'../../static/bgimg/4.jpg',
]
export default {
	components:{
		userSpaceHead,
		swiperTabHead,
		commonList,
		loadMore
	},
	data() {
		return {
			menuShow:false,
			userInfo:'',
			userCount:'',
			img:'',
			imgIndex:0,
			// 标题索引
			tabIndex:0,
			// 标题列表
			tabBars:[
				{name:"主页",id:"home"},
				{name:"动态",id:"dynamic"},
			],
			// 数据列表
			tabList:[
				{
					list:[]
				},
				{
					loadMoreText: "上拉加载更多",
					page:1,
					list:[]
				},
			]
		}
	},
	//监听原生导航栏按钮
	onNavigationBarButtonTap(e) {
		if(e.index==0){
			this.togleMenuShow();
		}
	},
	onShow() {
		this.imgIndex = Math.floor(Math.random()*3+1);
		this.img=bgimg[this.imgIndex]
	},
	onLoad(e) {
		this.__initUserData(e.userid);
	},
	methods: {
		//点击切换
		tabtap(index){
			this.tabIndex = index
		},
		__initUserData(id){	
			this.getUserInfo(id);
			this.getUserCount(id);
			this.getList(id);
		},
		async getUserInfo(id){
			let [err,res] = await this.$http.post('user/getuserinfo',{
					user_id:id,
					my_id:this.User.userinfo.id
				});
			if(!err){
				let data = res.data.data;
				let user =  {
				appAge:data.birthday ? time.gettime.getAgeByBirthday(data.birthday) : '秘密',
				appID:'0'+data.id,
				selfXz:data.birthday ? time.gettime.getHoroscope(data.birthday) : '保密',
				selfZy:job[data.job] || '保密',
				selfHome:data.path || '保密',
				selfLove:qg[data.qg] || '保密',	
				}
				let userinfo = {
					id:data.id,
					bgimg:1,
					userimg:data.userpic,
					username:data.username,
					isFocus:data.fans ? true : false,
				}
				this.userInfo=userinfo
				this.tabList[0].list.push(user)
			}else{
				uni.showToast({title:'用户数据拉取失败',icon:'none'})
				return;
			}
		},
		async getUserCount(id){
			let [err,res] = await this.$http.post('user/getusercount',{user_id:id});
			if(!err){
				let data = res.data.data;
				let usercount = {
					post_count: data.post_count,
					follow_count:data.follow_count,
					fans_count : data.fans_count,
				}
				this.userCount = usercount;
			}else{
				uni.showToast({title:'用户数据拉取失败',icon:'none'})
				return;
			}
		},
		async getList(id){
			let [err,res] = await this.$http.get(`index/userPost?user_id=${id}&page=1&my_id=${this.User.userinfo.id}`);
			if(!err){
				let data = res.data;
				let flag = (id == this.User.userinfo.id)
				if(data.code==200){
					for(let item of data.data){
						this.tabList[1].list.push(this.listFormat(item,flag))
					}
				}else{
					uni.showToast({title:'用户动态信息拉取失败'});
					return;
				}
			}else{
				uni.showToast({title:'用户动态信息拉取失败'});
				return;
			}
		},
		//格式化文章信息
		listFormat(item,flag){
			return {
				id:item.id,
				user_id:item.user_id,
				username:item.user.username,
				userimg:item.user.userpic,
				isFocus:flag ?  1 : item.fans.length,
				title:item.title,
				titleimg:item.titlepic,
				content:item.content,
				age:item.user.age,
				sex:item.user.sex,
				path:item.path,
				type:item.type,
				post_class_id:item.post_class_id,
				isopen:item.isopen,
				infonum:{
					index:(item.support) ? (item.support.type+1) : 0,//0代表没操作 1顶了  2踩了
					upnum:item.upnum,
					downnum:item.downnum,
				},
				imgList:item.imgList,
				fans:item.fans,
				commentnum:item.commentnum,
				upnum: item.upnum,
				sharenum:item.sharenum,
			}
		},
		focus(){
			let data={
				data:true
			}
			this.userInfo.isFocus = 1;
			this.updateFocus(data)
		},
		//修改关注数据
		updateDate(data){
			switch (data.type){
				case 'onFocus':
				this.updateFocus(data);
				this.focus()
				break;
			}
		},
		updateFocus(data){
			for (var item of this.tabList[1].list){
					item.isFocus = data.data;
			}
		},
		blackList(){
			console.log("拉入黑名单");
			this.hideMenuShow();
		},
		sendMsg(){
			console.log("发送消息");
			this.hideMenuShow();
		},
		hideMenuShow(){
			this.menuShow =false;
		},
		togleMenuShow(){
			this.menuShow = !this.menuShow
		},
		
	}
}
</script>

<style>
page{
	background: #f4f4f4;
}
.user-space-msg{
	padding:20upx  50upx 50upx;
	background: #FFFFFF;
}
.user-space-msg>view:first-child{
	padding-bottom: 25upx;
	border-bottom: 1upx solid #eee;
}
.tit{
	font-size: 32upx;
	font-weight: bold;
	color: #333;
	padding:12upx 0;
}
.fz{
	color: #999;
	padding: 5upx 0;
}

.user-space-menu{
	position: absolute;
	right: 10upx;
	top: 105upx;
	width: 250upx;
	background:#fff;
	z-index: 999;
	box-shadow: 0 0 2upx 2upx #eee;
}
.user-space-menu>view{
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 7upx 20upx;
}
.user-space-menu>view:first-child{
	border-bottom: 1upx solid #eee;
}
.user-space-menu>view>view{
	font-size: 32upx;
}
.user-space-menu>view>view:first-child{
	position: absolute;
	left: 20upx;
}
.user-space-menu>view>view:last-child{
	padding-left: 45upx;
	flex: 1;
}
.user-mask{
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0,0,0,.4);
	z-index: 99;
}
</style>
