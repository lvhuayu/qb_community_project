<template>
	<view>
		<!-- 顶部导航栏 -->
		<swiper-tab-head :tabBars="tabBars" :tabIndex="tabIndex" @tabtap="tabtap"
		scrollStyle="border-bottom:0;background:#fff;"
		scrollItemStyle="width:33.33333%;"></swiper-tab-head>
		<view class="uni-tab-bar">
			<swiper class="swiper-box" :indicator-dots="false" :autoplay="false" :interval="500" :duration="500" :style="{height:swiperHeight +'px'}"
			 :current="tabIndex" @change="tabChange">
				<swiper-item v-for="(items,index) in friendList" :key="index">
					<scroll-view class="list" @scrolltolower="loadMore(index)" scroll-y>
						<template v-if="items.list.length>0">
							<!-- 好友列表 -->
							<block v-for="(item,index1) in items.list" :key="index1">
								<friend-list :item="item" :index="index1" :stateClass="item.type" 
								 @escFocus.stop="escFocus"
									@tap.stop="goUser(item)"
									@cc="cc"
								  @focus="focus"></friend-list>
							</block>
							<!-- 上拉加载 -->
							<!-- <load-more :loadMoreText="items.loadMoreText"></load-more> -->
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
	import friendList from "../../components/user-list/friend-list.vue";
	import noThing from "../../components/common/no-thing.vue";
	export default {
		components:{
			swiperTabHead,
			friendList,
			noThing
		},
		data() {
			return {
				// 标题索引
				tabIndex:0,
				swiperHeight: 0,
				// 标题列表
				tabBars:[
					{name:"互相关注",id:"otherFocus",num:0},
					{name:"已关注",id:"focus",num:0},
					{name:"粉丝",id:"fans",num:0},
				],
				//好友列表
				friendList:[
					{
						//传入关注状态
						stateClass:"icon-huguan",
						list:[]
					},
					{
						//传入关注状态
						stateClass:"icon-pinglunicon-",
						list:[]
					},
					{
						//传入关注状态
						stateClass:"icon-icon-add",
						list:[]
					}
					
				]
			}
		},
		onLoad() {
			//获取信息
			
			this.__initData()
			//获取手机系统信息
			uni.getSystemInfo({
				success: (res) => {
					//获取可使用屏幕高度 再减去 顶部选项卡的高度，再调用方法转为upx
					let height = res.windowHeight - uni.upx2px(100);
					this.swiperHeight = height;
				}
			})
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
		onNavigationBarSearchInputClicked() {
			uni.navigateTo({
				url:'../search/search?searchType=user'
			})
		},
		methods: {
			async __initData(){
				await this.getFriends();
				await this.getFollows();
				await this.getFans();
			},
			//检查用户是否互相关注
			checkIsFriend(id){
				for(var item of this.friendList[0].list){
					if(item.id==id){
						return true
					}
				}
				return false
			},
			async getFriends(){
				let [err,res] = await this.$http.get(`handle/friends?user_id=${this.User.userinfo.id}`);
				if(!err){
					let data = res.data;
					if(data.code==200){
						this.tabBars[0].num = data.data.length;
						for(let item of data.data){
							let list ={
								id:item.id,
								uimg:item.userpic,
								uname:item.username,
								sex:item.userinfo.sex,//0男 1女
								age:item.userinfo.age,
								type:'icon-huguan',
							};
							this.friendList[0].list.push(list)
						}
					}else{
						uni.showToast({title:'好友列表获取失败'})
					}
				}else{
					uni.showToast({title:'好友列表获取失败'})
				}
			},
			async getFans(){
				let [err,res] = await this.$http.get(`handle/fans?user_id=${this.User.userinfo.id}`);
				if(!err){
					let data = res.data;
					if(data.code==200){
						this.tabBars[2].num = data.data.length;
						for(let item of data.data){
							let list ={
								id:item.id,
								uimg:item.userpic,
								uname:item.username,
								sex:item.userinfo.sex,//0男 1女
								age:item.userinfo.age,
								type:this.checkIsFriend(item.id) ? 'icon-huguan' :'icon-icon-add'
							};
							this.friendList[2].list.push(list)
						}
					}else{
						uni.showToast({title:'好友列表获取失败'})
					}
				}else{
					uni.showToast({title:'好友列表获取失败'})
				}
			},
			async getFollows(){
				let [err,res] = await this.$http.get(`handle/follows?user_id=${this.User.userinfo.id}`);
				if(!err){
					let data = res.data;
					if(data.code==200){
						this.tabBars[1].num = data.data.length;
						for(let item of data.data){
							let list ={
								id:item.id,
								uimg:item.userpic,
								uname:item.username,
								sex:item.userinfo.sex,//0男 1女
								age:item.userinfo.age,
								type:this.checkIsFriend(item.id) ? 'icon-huguan' :'icon-pinglunicon-',
							};
							this.friendList[1].list.push(list)
						}
					}else{
						uni.showToast({title:'好友列表获取失败'})
					}
				}else{
					uni.showToast({title:'好友列表获取失败'})
				}
			},
			//取关
			escFocus(res){
				if(res.src=='icon-huguan'){
					let item ;
					for(var i =0;i<this.friendList[0].list.length;i++){
						if(this.friendList[0].list[i].id==res.id){
							this.tabBars[0].num--;
							item = this.friendList[0].list.splice(i,1)
						}
					}
					for(var i =0;i<this.friendList[1].list.length;i++){
						if(this.friendList[1].list[i].id==res.id){
							item = this.friendList[1].list.splice(i,1)
							this.tabBars[1].num--;
						}
					}
					for(let i of this.friendList[2].list){
						if(item[0].id==i.id){
							i.type='icon-icon-add'
						}
					}
				}else if(res.src=='icon-pinglunicon-'){
					for(var i =0;i<this.friendList[1].list.length;i++){
						if(this.friendList[1].list[i].id==res.id){
							this.friendList[1].list.splice(i,1)
							this.tabBars[1].num--;
						}
					}
				}
			},
			//关注
			focus(res){
				for(let item of this.friendList[2].list){
					if(item.id==res.id){
						item.type='icon-huguan'
						this.friendList[0].list.unshift(item);
						this.friendList[1].list.unshift(item);
						this.tabBars[0].num++;
						this.tabBars[1].num++;
					}
				}
			},
			//去主页
			goUser(item){
				uni.navigateTo({
					url:'../user-space/user-space?userid='+item.id
				})
			},
			//点击切换
			tabtap(index){
				this.tabIndex = index
			},
			//滑动事件
			tabChange(e) {
				this.tabIndex = e.detail.current;
			},
		}
	}
</script>

<style>

</style>
