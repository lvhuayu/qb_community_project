<template>
	<view>
		<!-- 顶部选项卡组件 -->
		<swiper-tab-head :tabBars="tabBars" :tabIndex="tabIndex" @tabtap="tabtap"></swiper-tab-head>
		<!-- 主体内容 -->
		<view class="uni-tab-bar">
			<swiper class="swiper-box" :indicator-dots="false" :autoplay="false" :interval="500" :duration="500" :style="{height:swiperHeight +'px'}"
			 :current="tabIndex" @change="tabChange">
				<swiper-item v-for="(items,index) in newsList" :key="index">
					<scroll-view class="list" @scrolltolower="loadMore(index)" scroll-y>
						<template v-if="items.list.length>0">
							<!-- 主页列表渲染 -->
							<block v-for="(item,index1) in items.list" :key="index1">
								<!-- 图文列表组件 -->
								<view class="recupd">
									<hot-list :isChange="isChange" :item="item" :index="index1"></hot-list>
								</view>
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
	import swiperTabHead from "../../components/index/swiper-tab-head.vue";
	import noThing from "../../components/common/no-thing.vue";
	import loadMore from "../../components/common/load-more.vue";
	import hotList from "../../components/news/hot-list.vue";
	export default {
		components: {
			swiperTabHead,
			noThing,
			loadMore,
			hotList
		},
		data() {
			return {
				swiperHeight: 0,
				tabIndex: 0,
				//选项卡
				tabBars: [],
				newsList: [],
				isChange:false,
			}
		},
		onLoad(e) {
			//发布文章选择话题
			if(e.isChange){
				this.isChange = true;
				uni.setNavigationBarTitle({
					title:'选择所属话题'
				})
			}
			//获取手机系统信息
			uni.getSystemInfo({
				success: (res) => {
					//获取可使用屏幕高度 再减去 顶部选项卡的高度，再调用方法转为upx
					let height = res.windowHeight - uni.upx2px(100);
					this.swiperHeight = height;
				}
			})
			this.getTopicClass();
			
		},
		methods: {
			async getTopicClass(){
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
						this.tabBars.push({
							id:item.id,
							name:item.classname
						})
						this.newsList.push({
							loadMoreText:'上拉加载更多~',
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
				uni.showLoading({ title:'Loading...',mask:true});
				this.newsList[this.tabIndex].list=[];
				let topicClass = this.tabBars[this.tabIndex].id;
				let page = this.newsList[this.tabIndex].page;
				let url =`index/topicClass?id=${topicClass}&page=${page}`;
				let [err,res] = await this.$http.get(url);
				let data = res.data;
				if(data.code==200){
					for(var item of data.data.list){
						this.newsList[this.tabIndex].list.push(this.listFormat(item))
					}
				}
				uni.hideLoading()
				if(data.data.list.length<10){			
					this.newsList[this.tabIndex].loadMoreText="没有更多话题了~";
				}else{
					this.newsList[this.tabIndex].loadMoreText="上拉加载更多~";
				}
				uni.hideLoading()
			},//上拉加载事件
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
					titleimg:item.titlepic,
					title:`#${item.title}#`,
					introduce:item.desc,
					totalnum:942,
					todaynum:196,
				}
			},
			tabtap(index) {
				this.tabIndex = index;
			},
			//滑动事件
			tabChange(e) {
				this.tabIndex = e.detail.current;
				this.getList();
			},
		}
	}
</script>

<style>
.recupd{
	width: 90%;
	margin: 0 auto;
	padding: 10upx;
	color: #333;
}
</style>
