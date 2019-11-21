<template>
	<!-- 底部输入框 -->
	<view class="chat-bottom">
		<input type="text" placeholder="请文明发言" :focus="focus" @blur="blur" v-model="chatText" />
		<view class="icon iconfont icon-qunfaxiaoxi-" @tap="sendText"></view>
	</view>
</template>

<script>
	export default {
		props:{
			focus:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
				chatText:'',
			}
		},
		methods:{
			sendText(){
				this.$emit('sendText',this.chatText);
				this.chatText="";
			},
			blur(){
				this.$emit('blur')
			}
		}
	}
</script>

<style scoped>
.chat-bottom{
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	height: 120upx;
	background: #fff;
	border-top: 1upx solid #eee;
	display: flex;
	align-items: center;
}
.chat-bottom input{
	height: 80upx;
	flex: 1;
	padding-left: 20upx;
	margin:0 20upx;
	background: #f7f7f7;
	border-radius: 15upx;
}
.chat-bottom>view{
	width: 80upx;
	font-size: 45upx;
	color: #333333;
}	
</style>
