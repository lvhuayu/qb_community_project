<template>
	<view class="user-resetpwd">
		<input type="text" v-if="hasPassWord" v-model="oldPassWord" password
		 class="uni-input" placeholder="输入旧密码" />
		<input type="text" v-model="newPassWord" password
		 class="uni-input" placeholder="输入新密码" />
		<input type="text" v-model="againPassWord" password
		 class="uni-input" placeholder="确认新密码" />
		<button class="user-set-logout "
		 :class="{'user-set-logout-dis':disabled}"
		  type="primary" @tap="submit"
		  :disabled="disabled"
		  :loading="loading"
		  >确认修改</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				hasPassWord:false,
				oldPassWord:"",
				newPassWord:"",
				againPassWord:"",
				disabled:true,//按钮是否可以点击样式
				loading:false,//按钮点击加载动画
			}
		},
		watch:{
			oldPassWord(val){
				this.changeInfo();
			},
			newPassWord(val){
				this.changeInfo();
			},
			againPassWord(val){
				this.changeInfo();
			},
		},
		onLoad(e) {
			console.log(e.password)
			this.hasPassWord = !!(e.password && e.password !== 'false')
		},
		methods: {
			//监听输入框状态
			changeInfo(){
				if(this.hasPassWord){
					if(this.oldPassWord.trim() && this.newPassWord.trim() && this.againPassWord.trim()){
						this.disabled = false;
						return;
					}
				}else{
					if(this.newPassWord.trim() && this.againPassWord.trim()){
						this.disabled = false;
						return;
					}
				}
				this.disabled = true;
			},
			// 验证
			checkInfo(){
				if(this.hasPassWord){
					if(this.oldPassWord.trim() && this.newPassWord.trim() && this.againPassWord.trim()){
						if(this.newPassWord !== this.againPassWord){
							uni.showToast({
								title:"俩次密码不一致",
								icon:"none"
							})
							return false;
						};
						return true;
					}
				}else{
					if(this.newPassWord.trim() && this.againPassWord.trim()){
						if(this.newPassWord !== this.againPassWord){
							uni.showToast({
								title:"俩次密码不一致",
								icon:"none"
							})
							return false;
						};
						return true;
					}
				}
				uni.showToast({
					title:'请将数据填写完整',
					icon:'none'
				})
				return false;
			},
			//提交信息
			async submit(){
				if(! this.checkInfo()){ this.loading = false;this.disabled = false;  return; };
				this.loading = true;
				this.disabled =true;
				uni.showToast({ title:'密码修改中',icon:'none'})
				let [err,res] = await this.$http.post('user/rePassWord',{
					user_id:this.User.userinfo.id,
					oldpassword:this.oldPassWord,
					newpassword:this.newPassWord
				})
				if(!err){
					if(res.data.code==200){
						this.User.userinfo.password = this.newPassWord;
						uni.setStorageSync("userinfo",this.User.userinfo);
						setTimeout(()=>{
							this.loading = false;
							this.disabled = false;	
							uni.showToast({
								title:'修改成功',
								icon:'none',
								success: () => {
									uni.navigateBack({ delta: 1 });
								}
							});
						},1000)
					}else{
						uni.showToast({ title:'密码错误,修改失败',icon:'none'});
						this.loading = false;
						this.disabled = false;	
					}
				}else{
					uni.showToast({ title:'修改失败',icon:'none'})
				}
				
			}
		}
	}
</script>

<style>
.user-resetpwd{
	padding: 0 10upx;
}
.user-resetpwd button{
	width: 84%;
	margin: 30upx auto;
	background: #ffe933;
	color: #333333;
}
.user-set-logout-dis{
	background: #f4f4f4 !important;
	color: #999 !important;
}
.uni-input{
	padding-left: 30upx;
	height: 60upx;
	border-bottom: 1upx solid #eee;
	font-size:32upx;
}
</style>
