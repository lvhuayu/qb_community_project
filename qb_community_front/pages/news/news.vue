<template>
	<view>

		<news-nav-bar :tabBars="tabBars" :tabBarIndex="tabBarIndex" @change-tab="changeTab"></news-nav-bar>

		<view class="uni-tab-bar">
			<swiper class="swiper-box" :indicator-dots="false" :autoplay="false" :interval="500" :duration="500" :style="{height:swiperHeight +'px'}"
			 :current="tabBarIndex" @change="tabChange">
				<!-- 关注 -->
				<swiper-item>
					<scroll-view class="list" scroll-y @scrolltolower="loadMore">
						<!-- 列表 -->
						<template v-if="isLogin">
							<block v-for="(item,index) in focus[0].list" :key="index">
								<common-list :item="item" :index="index"></common-list>
							</block>
							<!-- 上拉加载 -->
							<load-more :loadMoreText="focus.loadMoreText"></load-more>
						</template>
						<template v-else>
							<view class="no-follows animated bounceIn">
								<image src="../../static/common/nofollows.png" mode="widthFix" lazy-load></image>
							</view>
							<view class="no-followstext">{{txt}}</view>
						</template>
					</scroll-view>
				</swiper-item>
				<!-- 话题 -->
				<swiper-item>
					<scroll-view class="list bg" scroll-y>
						<!-- 搜索框 -->
						<view class="search">
							<input class="uni-input"
							 placeholder-class="icon iconfont icon-shiliangzhinengduixiang pltext"
							 disabled
							 @tap="openSearch"
							 placeholder="搜索话题" />
						</view>
						<!-- 轮播图 -->
						<swiper class="top-swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
							<block v-for="(item,index) in toppic.swiper" :key="index">
								<swiper-item>
									<image :src="item.src" mode="widthFix" lazy-load></image>
								</swiper-item>
							</block>
						</swiper>
						<!-- 热门分类 -->
						<hot-class-nav :classnav="classnav"></hot-class-nav>
						<!-- 最近更新 -->
						<view class="recupd">
							<view class="rec-tit">最近更新</view>
							<block v-for="(item,index) in hotlist" :key="index">
								<hot-list :item="item" :index="index"></hot-list>
							</block>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import commonList from "../../components/common/common-list.vue";
	import newsNavBar from "../../components/news/news-nav-bar.vue";
	import loadMore from "../../components/common/load-more.vue";
	import hotClassNav from "../../components/news/hot-class-nav.vue";
	import hotList from "../../components/news/hot-list.vue";
	export default {
		components: {
			commonList,
			newsNavBar,
			loadMore,
			hotClassNav,
			hotList
		},
		data() {
			return {
				swiperHeight: 500,
				tabBarIndex: 0,
				tabBars: [{
						name: "关注",
						id: "focus"
					},
					{
						name: "话题",
						id: "topic"
					}
				],
				focus: [],
				//轮播图
				toppic: {
					//轮播图
					swiper: [],
				},
				//热门分类标题
				classnav:[],
				// 热门话题列表
				hotlist:[],
				isLogin:false,
				txt:'登录查看更多'
			}
		},
		onShow(){
			if(this.User.token){
				this.getFollowsArticle();
			}
		},
		onLoad() {
			this.__initDate();
			//获取手机系统信息
			uni.getSystemInfo({
				success: (res) => {
					//获取可使用屏幕高度 再减去 顶部选项卡的高度，再调用方法转为upx
					let height = res.windowHeight - uni.upx2px(100);
					this.swiperHeight = height;
				}
			})
		},
		methods: {
			//初始化数据
			__initDate(){
				this.getSwiper();
				this.getHotClass();
				this.getTopicList();
			},
			//获取广告
			async getSwiper(){
				let [err,res] = await this.$http.get('index/advList?type=0');
				if(!err){
					let data = res.data;
					for(var item of data.data){
						this.toppic.swiper.push({
							url:item.url,
							src:item.src
						})
					}
				}else{
					uni.showToast({
						title:'网络错误~',
						icon:'none'
					})
				}
			},
			//获取热门分类
			async getHotClass(){
				let [err,res] =await this.$http.get('index/getTopicClass');
				if(err){
					uni.showToast({
						title:'网络开小差了',
						icon:'none'
					})
				}
				let data = res.data;
				if(data.code==200 && data.data){
					for(var item of data.data.list){
						this.classnav.push({
							id:item.id,
							name:item.classname
						})
					}
				}
			},
			//获取热门话题
			async getTopicList(){
				let [err,res] =await this.$http.get('index/hotTopic');
				if(err){
					uni.showToast({
						title:'网络开小差了',
						icon:'none'
					})
				}
				let data = res.data;
				if(data.code==200 && data.data){
					for(var item of data.data.list){
						this.hotlist.push({
								id:item.id,
								titleimg:item.titlepic,
								title:`#${item.title}#`,
								introduce:item.desc,
								totalnum:942,
								todaynum:196,
						})
					}
				}
			},
			//获取关注人列表信息
			async getFollowsArticle(){
					this.isLogin = true;
					this.focus = [{loadMoreText: "上拉加载更多",list:[],page:1}];
					let [err,res] =await this.$http.get(`handle/followsArticle?user_id=${this.User.userinfo.id}`);
					if(!err){
						let data = res.data;
						if(data.code==200){
							if(data.data.length){
								for(var item of data.data){
									this.focus[0].list.push(this.listFormat(item))
								}
							}else{
								this.txt = '可能Ta没发过糗事吧~';
								this.isLogin =false;
							}
						}else{
							this.txt = '还未关注糗友';
							this.isLogin =false;
						}
					}
			},
			//格式化文章信息
			listFormat(item){
				return {
					id:item.id,
					user_id:item.user_id,
					username:item.user.username,
					userimg:item.user.userpic,
					isFocus:1,
					title:item.title,
					titleimg:item.titlepic,
					content:item.content,
					age:item.userinfo.age,
					sex:item.userinfo.sex,
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
			//点击切换
			changeTab(index) {
				this.tabBarIndex = index;
			},
			//跳转到发布页
			release() {
				//跳转到发布页
				uni.navigateTo({
					url: '../release/release',
				})
			},
			//滑动切换
			tabChange(e) {
				this.tabBarIndex = e.detail.current;
			},
			//上拉加载
			loadMore() {
				if (this.focus.loadMoreText != "上拉加载更多") {
					return;
				};
				//修改状态
				this.focus.loadMoreText = "加载中...";
				//获取数据
				//ES6箭头函数没有this指向，所以里面的this直接指向Vue
				setTimeout(() => {
					//获取完成
					let obj = {
						userimg: "../../static/demo/1567584489298myimg.jpeg",
						username: "王九蛋",
						sex: 0, //0男 1 女
						age: 25,
						isFocus: false,
						title: "这是我的标题啊！！！",
						titleimg: "../../static/demo/15611049029292019-6-21web3_4.jpg",
						video: false,
						share: false,
						path: "北京 顺义",
						sharenum: 20,
						commentnum: 40,
						goodnum: 99
					};
					this.focus.list.push(obj);
					this.focus.loadMoreText = "上拉加载更多"
				}, 1000);
				//this.newsList[index].loadMoreText="没有更多糗事了";
			},
			//打开搜索页
			openSearch(){
				uni.navigateTo({
					url: '../search/search?searchType=topic',
				});
			},
		}
	}
</script>

<style>

.bg {
	background: #fff;
}

.search {
	padding: 20px;
}

.search>input {
	background: #f4f4f4;
	border-radius: 15upx;
}


/* 搜索框 */
.pltext {
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 30upx;
}

/* 轮播图 */
.top-swiper {
	padding: 0 20upx 20upx 20upx;
}

.top-swiper swiper-item {
	border-radius: 10upx;
	overflow: hidden;
}

.top-swiper image {
	width: 100%;
	height: 100%;
}
.recupd{
	width: 90%;
	margin: 0 auto;
	padding: 10upx;
	color: #333;
}
.no-follows{
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 100upx;
}
.no-follows>image{
	width: 50%;
	height: 50%;
}
.no-followstext{
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 32upx;
	color: #999;
}
</style>
