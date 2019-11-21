<template>
	<view>
		<scroll-view id="scrollView" scroll-y :scroll-top="scrollTop"
		 :scroll-with-animation="true"
		 :style="{height:style.contentHeight+'px'}"
		 >
			<!-- 聊天列表 -->
			<block v-for="(item,index) in list" :key="index">
				<view class="chat-item">
				<user-chat-list :item="item" :index="index"></user-chat-list>
				</view>
			</block>
		</scroll-view>
		
		<!-- 底部输入框 -->
		<user-chat-bottom  @sendText="sendText"></user-chat-bottom>
	</view>
</template>

<script>
	import userChatBottom from "../../components/user-chat/user-chat-bottom.vue";
	import userChatList  from "../../components/user-chat/user-chat-list.vue";
	import time from "../../common/time.js";
	export default {
		components:{
			userChatBottom,
			userChatList
		},
		data() {
			return {
				//滚动条位置
				scrollTop:0,
				style:{
					contentHeight:0,
					itemHeight:0,
				},
				list:[],
			}
		},
		onReady() {
			this.getChatData();
			this.initData();
			this.pageToBottom(true);
		},
		methods: {
			//初始化参数
			initData(){
				try {
				    const res = uni.getSystemInfoSync();
					this.style.contentHeight = res.windowHeight - uni.upx2px(150);
				} catch (e) {}
			},
			//聊天框置底
			pageToBottom(isFirst = false){
				//开启获取DOM元素信息
				let q = uni.createSelectorQuery().in(this);
				//获取所有聊天信息信息
				let itemH = isFirst ? q.selectAll('.chat-item') : q.select('.chat-item');
				this.$nextTick(function(){
					itemH.fields({
						size:true//获取DOM的高和宽{width:xx,height:xx}
					},data =>{
						//data就是获取到的信息数组用了All
						if(data){
							if(Array.isArray(data)){
								for (let i =0 ;i<data.length;i++) {
									this.style.itemHeight += data[i].height;
								}
							}else{
								this.style.itemHeight += data.height;
							}
							if(this.style.itemHeight > this.style.contentHeight){
								this.scrollTop = this.style.itemHeight;
							}
						}
					}).exec(()=>{
						
					})
				})
				//获取滚动窗口对象
				// q.select('#scrollView').boundingClientRect();
				// //获取每个聊天信息对象
				// q.selectAll('.user-chat-lists').boundingClientRect();
				// q.exec((res)=>{
				// 	res[1].forEach((ret) =>{
				// 		console.log(ret.height)
				// 		this.style.itemHeight += ret.height;
				// 	})
				// })
				// //如果聊天信息的所有高度大于内容区的高度，改变内容区高度和聊天信息高度一样
				// if(this.style.itemHeight > this.style.contentHeight){
				// 	this.scrollTop = this.style.itemHeight;
				// }
			},
			//获取聊天数据
			getChatData(){
				//假装是获取到的数据
				let arr= [
					{
						inFrom:false,//好友发的为false
						userimg:"../../static/bgimg/3.jpg",
						type:"text",
						chatData:"嗨~想和我聊天吗?",
						chatTime:new Date().getTime(),
					}
				];
				for(let i =0 ;i<arr.length;i++){
					//调用时间处理库函数，将时间戳处理为人性化时间格式，并添加到gstime里
					arr[i].gstime = time.gettime.getChatTime(arr[i].chatTime,i>0?arr[i-1].chatTime:0);
				}
				this.list = arr;
			},
			//发送聊天信息
			sendText(chatText){
				let nowTime = new Date().getTime();
				let obj={
					inFrom:true,//好友发的为false
					userimg:this.User.userinfo.userpic,
					type:"text",
					chatData:chatText,
					chatTime:nowTime,
					gstime:time.gettime.getChatTime(nowTime,this.list[this.list.length-1].chatTime)
				};
				this.list.push(obj);
				this.pageToBottom();
				this.autoRply();
			},
			//客服自动回复信息,后期考虑接入人工智能
			autoRply(){
				let nowTime = new Date().getTime();
				let obj={
					inFrom:false,//好友发的为false
					userimg:'../../static/bgimg/3.jpg',
					type:"text",
					chatData:'抱歉,系统现在正在升级呢,听不懂你说的什么。',
					chatTime:nowTime,
					gstime:time.gettime.getChatTime(nowTime,this.list[this.list.length-1].chatTime)
				};
				setTimeout(()=> {
					this.list.push(obj);
					this.pageToBottom();
				}, 1000);
			},
		}
	}
</script>

<style>

</style>
