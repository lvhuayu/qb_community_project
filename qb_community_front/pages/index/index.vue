<template>
	<view>
		<!-- 顶部选项卡组件 -->
		<swiper-tab-head :tabBars="tabBars" :tabIndex="tabIndex" @tabtap="tabtap"></swiper-tab-head>
		<!-- 主体内容 -->
		<view class="uni-tab-bar">
			<swiper class="swiper-box" 
			:indicator-dots="false" 
			:autoplay="false" 
			:interval="500" 
			:duration="500" 
			:style="{height:swiperHeight +'px'}" :current="tabIndex" @change="tabChange">
				<swiper-item v-for="(items,index) in newsList" :key="index" >
					<scroll-view class="list" @scrolltolower="loadMore(index)"  scroll-y >
						<template v-if="items.list.length>0">
							<!-- 主页列表渲染 -->
							<block v-for="(item,index1) in items.list" :key="index1">
								<!-- 图文列表组件 -->
								<card-list :item="item" :index="index1" @updateEvent="updateDate"></card-list>
							</block>
							<!-- 上拉加载 -->
							<load-more :loadMoreText="items.loadMoreText"></load-more>
						</template>
						<template v-else>
							<!-- 无内容默认 -->
							<no-thing></no-thing>
						</template>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import cardList from "../../components/index/card-list.vue";
	import swiperTabHead from "../../components/index/swiper-tab-head.vue";
	import loadMore from "../../components/common/load-more.vue";
	import noThing from "../../components/common/no-thing.vue";
	export default {
		components:{
			cardList,
			swiperTabHead,
			loadMore,
			noThing
		},
		data() {
			return {
				//设置内容区高度选项卡切换容器
				swiperHeight:0,
				//顶部选项卡列表
				//选项卡索引
				tabIndex:0,
				//选项卡
				tabBars: [],
				//内容假数据
				//每个选项卡的数据
				newsList:[],
			}
		},
		onLoad() {
			this.getArticleClass();
			//获取手机系统信息
			uni.getSystemInfo({
				success:(res)=>{
					//获取可使用屏幕高度 再减去 顶部选项卡的高度，再调用方法转为upx
					let height = res.windowHeight - uni.upx2px(100);
					this.swiperHeight = height;
				}
			})
		},
		//监听原生搜索框点击事件
		onNavigationBarSearchInputClicked() {
			uni.navigateTo({
				url:'../search/search',
			});
		},
		//监听原生标题导航按钮点击事件
		onNavigationBarButtonTap(e) {
			//e.index为按钮的索引，如果有俩个按钮就0 ，1
			switch(e.index){
				case 0:
				break;
				case 1:
				if(this.User.token){
					uni.navigateTo({url:'../release/release?postClass='+JSON.stringify(this.tabBars)})
				}else{
					uni.showToast({title: '请先登录~',icon:'none'});
				}
				break;
			}
		},
		onShow(){
			this.getList()
		},
		methods: {
			//请求文章分类
			async getArticleClass(){
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
						this.tabBars.push({
							id:item.id,
							name:item.classname
						})
						this.newsList.push({
							loadMoreText:'上拉加载更多',
							list:[],
							page:1,
						})
					}
				}
				if(this.tabBars.length>0){
					this.getList();
				}else{
					uni.showToast({
						title:'网络错误',
						icon:'none'
					})
				}
			},
			//请求指定类型文章
			async getList(){
				uni.showLoading({title:'Loading...',mask:false});
				this.newsList[this.tabIndex].list =[]
				let postClass = this.tabBars[this.tabIndex].id;
				let page = this.newsList[this.tabIndex].page;
				let url =`index/postClassArticle?id=${postClass}&page=${page}&user_id=${this.User.userinfo.id}`;
				let [err,res] = await this.$http.get(url);
				let data = res.data;
				if(data.code==200){
					for(var item of data.data){
						this.newsList[this.tabIndex].list.push(this.listFormat(item))
					}
				}
				if(data.data.length<10){			
					this.newsList[this.tabIndex].loadMoreText="没有更多糗事了~";
				}else{
					this.newsList[this.tabIndex].loadMoreText="上拉加载更多~";
				}
				uni.hideLoading();
			},
			tabtap(index){
				this.tabIndex = index;
			},
			tabChange(e){
				this.tabIndex = e.detail.current;
				this.getList();
			},
			//上拉加载事件
			loadMore(index){
				if(this.newsList[index].loadMoreText != "上拉加载更多~"){ return; };
				//修改状态
				this.newsList[index].loadMoreText="加载中...";
				//获取数据
				this.newsList[this.tabIndex].page++;
				this.getList();
			},
			//格式化文章信息
			listFormat(item){
				return {
					id:item.id,
					user_id:item.user_id,
					uname:item.user[0].username,
					uimg:item.user[0].userpic,
					isFocus:item.fans.length>0 ? true :false,
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
						upnum:item.upnum,
						downnum:item.downnum,
					},
					imgList:item.imgList,
					fans:item.fans,
					commentnum:item.commentnum,
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
				for (var item of this.newsList[this.tabIndex].list){
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
