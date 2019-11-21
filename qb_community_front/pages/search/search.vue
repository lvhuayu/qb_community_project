<template>
	<view>
		<template v-if="list.length>0">
			<block v-for="(item,index) in list" :key="index">
			<!-- 图文列表组件 -->
			<template v-if="searchType=='post'">
				<card-list :item="item" :index="index" @updateEvent="updateDate"></card-list>
			</template>
			<template v-else-if="searchType=='topic'">
				<hot-list :item="item" :index="index"></hot-list>
			</template>
			<template v-else-if="searchType=='user'">
				<friend-list :item="item" :index="index" :stateClass="item.type"  @escFocus="escFocus" @focus="focus" isHide></friend-list>
			</template>
			</block>
			<!-- 上拉加载 -->
			<load-more :loadMoreText="loadMoreText"></load-more>
		</template>
		<template v-else-if="isSearch && list.length<1">
			<!-- 无内容默认 -->
			<no-thing></no-thing>
		</template>
	</view>
</template>

<script>
	import cardList from "../../components/index/card-list.vue";
	import noThing from "../../components/common/no-thing.vue";
	import loadMore from "../../components/common/load-more.vue";
	import hotList from "../../components/news/hot-list.vue";
	import friendList from "../../components/user-list/friend-list.vue";
	export default {
		components:{
			cardList,
			noThing,
			loadMore,
			hotList,
			friendList
		},
		data() {
			return {
				isSearch:false,
				loadMoreText:"上拉加载更多",
				list:[],
				searchText:"",
				page:1,
				searchType:'',
			}
		},
		onLoad(e) {
			if(!e) return;
			this.searchType = e.searchType || 'post';
			if(this.searchType=='topic'){
				//拿到当前页面
				let currentWebView = this.$mp.page.$getAppWebview();
				//获取当前页面导航栏
				let tn = currentWebView.getStyle().titleNView;
				//修改搜索框内容
				tn.searchInput.placeholder = '搜索话题';
				//赋值
				currentWebView.setStyle({
					titleNView:tn
				})
			}else if(this.searchType=='user'){
				//拿到当前页面
				let currentWebView = this.$mp.page.$getAppWebview();
				//获取当前页面导航栏
				let tn = currentWebView.getStyle().titleNView;
				//修改搜索框内容
				tn.searchInput.placeholder = '搜索用户';
				//赋值
				currentWebView.setStyle({
					titleNView:tn
				})
			}
			//开启全局监听
			uni.$on('updateData',this.updateDate)
		},
		//监听原生标题导航按钮点击事件
		onNavigationBarButtonTap(e) {
			// {"color":"#333333","colorPressed":"#666666","float":"right","fontSize":"16px","text":"取消","__cb__":{"id":"plus141569586133004","htmlId":"__uniapp__service"},"index":0}
			//e.index为按钮的索引，如果有俩个按钮就0 ，1
			if(e.index==0){
				//向前页退回
				uni.navigateBack({
					delta:1//向前页退回一级
				});
			}
		},
		//监听搜索框文本变化
		onNavigationBarSearchInputChanged(e) {
			// e为{"text":"461而已"}文本内容每变化一次就监听一次
			this.searchText = e.text;
		},
		//监听软键盘点击搜索按钮事件
		onNavigationBarSearchInputConfirmed(e) {
			if(e.text){
				this.searchData();
			}
		},
		onReachBottom() {
			this.loadMore();
		},
		//监听下拉刷新
		onPullDownRefresh() {
			this.searchData();
			uni.stopPullDownRefresh();
		},
		methods: {
			//搜索事件
			async searchData(){
				uni.showLoading({
					title:'Loading...',
					mask:true
				});
				this.list=[];
				this.getList();
			},
			//请求指定类型文章
			async getList(){
				let url;
				switch (this.searchType){
					case 'post':
					url = "search/searchPost";
					break;
					case 'topic':
					url = "search/searchTopic";
					break;
					case 'user':
					url = "search/searchUser"
				}
				let [err,res] = await this.$http.post(url,{
					keyword:this.searchText,
					page:this.page,
					user_id:this.User.userinfo.id 
				})
				if(!err){
					let data = res.data;
					uni.hideLoading();
					if(data.code==200){
						if(data.data.length){
							for(var item of data.data){ 
								this.list.push(this.listFormat(item))
							}
							uni.hideLoading();
						}else{
							this.isSearch = true;
							uni.hideLoading();
						}
					}
					if(data.data.length<10){
						this.loadMoreText="没有更多数据了~";
					}else{
						this.loadMoreText="上拉加载更多~";
					}
				}else{
					uni.showToast({
						title:'网络开小差啦~'
					})
				}
				uni.hideLoading();
			},
			//上拉加载事件
			loadMore(){
				if(this.loadMoreText != "上拉加载更多~"){ return; };
				//修改状态
				this.loadMoreText="加载中...";
				//获取数据
				this.page++;
				this.getList();
			},
			//格式化文章信息
			listFormat(item){
				switch(this.searchType){
					case 'post':
					return {
						id:item.id,
						user_id:item.user_id,
						uname:item.user[0].username,
						uimg:item.user[0].userpic,
						isFocus:item.fans.length,
						title:item.title,
						titimg:item.titlepic,
						content:item.content,
						age:item.user[0].age,
						sex:item.user[0].sex,
						path:item.user[0].path,
						type:item.type,
						post_class_id:item.post_class_id,
						isopen:item.isopen,
						infonum:{
							index:(item.support) ? (item.support.type+1) : 0,//0代表没操作 1顶了  2踩了
							upnum:11,
							downnum:11,
						},
						imgList:item.imgList,
						fans:item.fans,
						commentnum:10,
						share:item.sharenum,
					}
					break;
					case 'topic':
					return {
						id:item.id,
						titleimg:item.titlepic,
						title:`#${item.title}#`,
						introduce:item.desc,
						totalnum:942,
						todaynum:196,
					}
					break;
					case 'user':
					return {
						id:item.id,
						uimg:item.userpic,
						uname:item.username,
						sex:item.userinfo.sex,
						age:item.userinfo.age,
					}
					break;
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
				for (var item of this.list){
					if(item.user_id==data.user_id){
						item.isFocus = data.data;
					}
				}
			},
		}
	}
</script>

<style>

</style>
