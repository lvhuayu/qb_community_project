<template>
	<view>
		<!-- 话题详情信息 -->
		<topic-info :item="topicInfo"></topic-info>
		<!-- 话题详情切换 -->
		<swiper-tab-head :tabBars="tabBars" :tabIndex="tabIndex" @tabtap="tabtap" 
		scrollStyle="border-bottom:0;background:#fff;" scrollItemStyle="width:50%;"></swiper-tab-head>
		<!-- 公告列表 -->
		<view class="topic-detail-list">
			<block v-for="(item,index) in tabList" :key="index">
				<template v-if="tabIndex==index">
					<template v-if="item.list.length>0">
						<!-- 列表 -->
						<block v-for="(list,listIndex) in item.list" :key="listIndex">
							<common-list :item="list" :index="listIndex" @updateEvent="updateDate"></common-list>
						</block>
						<!-- 上拉加载 -->
						<load-more :loadMoreText="item.loadMoreText"></load-more>
					</template>
					<template v-else>
						<!-- 无内容默认 -->
						<view class="nothingTxt">这个话题好像没有人讨论~</view>
					</template>
				</template>
			</block>
		</view>
	</view>
</template>

<script>
	import topicInfo from "../../components/topic/topic-info.vue";
	import swiperTabHead from "../../components/index/swiper-tab-head.vue";
	import commonList from "../../components/common/common-list.vue";
	import loadMore from "../../components/common/load-more.vue";
	export default {
		components:{
			topicInfo,
			swiperTabHead,
			commonList,
			loadMore,
		},
		data() {
			return {
				topicInfo:{
					topicBg:"../../static/demo/15611049029292019-6-21web3_4.jpg",
					titleImg:"../../static/demo/1568986634772user1.jpg",
					title:"#忆往事，敬余生#",
					totalnum:650,
					todaynum:233,
					introduce:"面试官：在电梯里巧遇马云你会做什么？90后女孩回答被当场录用",
				},
				// 标题索引
				tabIndex:0,
				// 标题列表
				tabBars:[
					{name:"默认",id:"defut"},
					{name:"最新",id:"new"},
				],
				// 数据列表
				tabList:[
					{loadMoreText: "上拉加载更多",list:[],page:1},
					{loadMoreText: "上拉加载更多",list:[],page:1}
				]
			}
		},
		onLoad(e) {
			this.__initDate(JSON.parse(e.detailTopic));
			//开启全局监听
			uni.$on('updateData',this.updateDate)
		},
		//上拉触底事件
		onReachBottom() {
			//上拉加载
			this.loadMore()
		},
		//下拉刷新
		onPullDownRefresh() {
			this.getData();
		},
		methods: {
			__initDate(val){
				//修改标题
				uni.setNavigationBarTitle({ title:val.title });
				// uni.showLoading({ title:'Loading...' })
				this.topicInfo = {
					id:val.id,
					topicBg:val.titleimg,
					titleImg:val.titleimg,
					title:val.title,
					totalnum:650,
					todaynum:233,
					introduce:val.introduce,
				}
				this.getList()
			},
			//点击切换
			tabtap(index){
				this.tabIndex = index;
				this.tabList[this.tabIndex].page==1;
				this.getList();
			},
			//获取数据
			async getList(){
				let url = `index/topicPost?id=${this.topicInfo.id}&page=${this.tabList[this.tabIndex].page}&user_id=${this.User.userinfo.id}`;
				let [err,res] = await this.$http.get(url);
				let data = res.data;
				if(data.code==200){
					this.tabList=[{loadMoreText: "上拉加载更多",list:[],page:1},
								   {loadMoreText: "上拉加载更多",list:[],page:1}]
					for(var item of data.data){
						this.tabList[this.tabIndex].list.push(this.listFormat(item))
					}
				}
				if(data.data.length<10){			
					this.tabList[this.tabIndex].loadMoreText="没有更多糗事了~";
				}else{
					this.tabList[this.tabIndex].loadMoreText="上拉加载更多~";
				}
				//图文例子
				// {
				// 	userimg: "../../static/demo/1567584489298myimg.jpeg",
				// 	username: "王九蛋",
				// 	sex: 0, //0男 1 女
				// 	age: 25,
				// 	isFocus: false,
				// 	title: "这是我的标题啊！！！",
				// 	titleimg: "../../static/demo/15611049029292019-6-21web3_4.jpg",
				// 	video: false,
				// 	share: false,
				// 	path: "北京 顺义",
				// 	sharenum: 20,
				// 	commentnum: 40,
				// 	goodnum: 99
				// },
			},
			//上拉刷新获取数据
			getData(){
				this.getList();
				uni.stopPullDownRefresh();
			},
			//上拉加载
			loadMore() {
				if (this.tabList[this.tabIndex].loadMoreText != "上拉加载更多~") {
					return;
				};
				this.tabList[this.tabIndex].loadMoreText = "加载中...";
				this.tabList[this.tabIndex].page++;
				this.getList();
				
			},
			//格式化文章信息
			listFormat(item){
				return {
					id:item.id,
					user_id:item.user_id,
					username:item.user[0].username,
					userimg:item.user[0].userpic,
					isFocus:item.fans.length,
					title:item.title,
					titleimg:item.titlepic,
					content:item.content,
					age:item.user[0].age,
					sex:item.user[0].sex,
					path:item.user[0].path,
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
			//修改关注数据
			updateDate(data){
				switch (data.type){
					case 'onFocus':
					this.updateFocus(data)	
					break;
				}
			},
			updateFocus(data){
				for (var item of this.tabList[this.tabIndex].list){
					if(item.user_id==data.user_id){
						item.isFocus = data.data;
					}
				}
			},
		}
	}
</script>

<style>
page {
	background: #ecf0f1;
}
.nothingTxt{
	margin-top: 100upx;
	font-size: 32upx;
	color: #171606;
	display: flex;
	justify-content: center;
	color: #999;
}
</style>
