<template>
	<view >
		<!-- 操作菜单 -->
		<paper-handle-menu :handleShow="handleShow"
		 @addFirend="addFirend" @clearNoRead="clearNoRead"
		 @hideHandle="hideHandle"
		  ></paper-handle-menu>
		
		<!-- 小纸条列表 -->
		<block v-for="(item,index) in list" :key="index">
			<!-- 小纸条列表 -->
			<paper-list :item="item" :index="index"></paper-list>
		</block>
	</view>
</template>

<script>
	import paperList from "../../components/paper/paper-list.vue";
	import paperHandleMenu from "../../components/paper/paper-handle-menu.vue";
	export default {
		components:{
			paperList,
			paperHandleMenu
		},
		data() {
			return {
				handleShow:false,
				loadMoreText:"上拉加载更多",
				list:[
					{
						userimg:"../../static/bgimg/3.jpg",
						username:"中国好客服",
						time:"13:14",
						msg:"聊天功能小编努力开发中...",
						noreadnum:99
					},
				]
			}
		},
		//监听下拉刷新事件
		onPullDownRefresh() {
			this.getPaperData();
		},
		//监听页面上拉触底事件
		onReachBottom() {
			this.loadMore()
		},
		//监听导航栏按钮事件
		onNavigationBarButtonTap(e) {
			if(e.index==1){
				this.showHandle()
			}else if (e.index==0){
				this.goFriends();
				this.hideHandle();
			}
		},
		methods: {
			//跳转到好友列表
			goFriends(){
				if(!this.User.userinfo){
					return uni.showToast({title:'请先登录~'})
				}
				uni.navigateTo({url:"../user-list/user-list",})
			},
			//添加糗友
			addFirend(){
				uni.showToast({title:'功能开发中,敬请期待'})
				this.hideHandle();
			},
			//清除未读
			clearNoRead(){
				uni.showToast({title:'功能开发中,敬请期待'})
				this.hideHandle();
			},
			//显示操作菜单
			showHandle(){
				this.handleShow = true;
			},
			//隐藏操作菜单
			hideHandle(){
				this.handleShow = false;
			},
			//获取下拉刷新数据
			getPaperData(){
				setTimeout(()=> {
					uni.showToast({title:'功能开发中,敬请期待',icon:'none'})
					uni.stopPullDownRefresh();
				}, 2000);
			},
		}
	}
</script>

<style>


</style>
