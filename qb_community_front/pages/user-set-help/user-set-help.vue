<template>
	<view class="user-set-help">
		<uni-collapse>
			<block v-for="(item,index) in list" :key="index">
				<uni-collapse-item :show-animation="true" :title="item.title" :contentData="item.content">
				</uni-collapse-item>
			</block>
			
		</uni-collapse>
		<button class="user-set-logout" hover-class="btn-hover-class" type="primary" @tap="Hello">意见反馈</button>
	</view>
</template>

<script>
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'
	export default {
		components:{
			uniCollapse,
			uniCollapseItem
		},
		data() {
			return {
				list:[
					{
						title:"客服什么时候上线?",
						content:"目前没有客服，非常抱歉！"
					},
					{
						title:"忘记账号/密码怎么办?",
						content:"修改一下就行了！",
					},
					{
						title:"怎么搜索/关注用户呢?",
						content:"自己看！",
					},
				]
			}
		},
		methods: {
			Hello(){
				uni.showToast({
					title:'非常抱歉的告诉你,客服小姐姐约会去了~',
					duration:3000,
					icon:'none'
				})
			}
		}
	}
</script>

<style>
.user-set-help button{
	width: 84%;
	margin: 30upx auto;
	background: #ffe933;
	color: #333333;
}
.btn-hover-class{
	background: #f4f4f4 !important;
	color: #ccc !important;
}
</style>
