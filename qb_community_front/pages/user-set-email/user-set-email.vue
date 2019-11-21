<template>
	<view>
		<view class="user-resetpwd">
			<input type="text" v-model="email" class="uni-input" placeholder="输入需要绑定的邮箱" />
			<button class="user-set-logout " :class="{'user-set-logout-dis':disabled || isBind}" type="primary" @tap="submit" :disabled="disabled || isBind"
			 :loading="loading">{{isBind ? "已绑定" : "立即绑定"}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isBind:false,
				email: "",
				disabled:true,//按钮是否可以点击样式
				loading:false,//按钮点击加载动画
			}
		},
		watch: {
			email(val) {
				this.changeInfo();
			},
			password(val) {
				this.changeInfo();
			},
		},
		onLoad(e) {
			this.isBind = !!(e.email && e.email !== 'false')
		},
		methods: {
			//监听输入框状态
			changeInfo() {
				if ( this.email.trim()) {
					this.disabled = false;
					return;
				}
				this.disabled = true;
			},
			// 验证
			checkInfo() {
				if ( this.email.trim()) {
					//验证邮箱是否合法
					let ePattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
					if(!ePattern.test(this.email)){
						uni.showToast({
							title:"请填写正确邮箱格式",
							icon:"none"
						})
						return false;
					}
					return true;
				}
				uni.showToast({
					title: '请将数据填写完整',
					icon: 'none'
				});
				return false;
			},
			//提交信息
			async submit() {
				this.loading = true;
				this.disabled = true;
				if (!this.checkInfo()) {
					this.loading = false;
					this.disabled = false;
					return;
				};
				let [err,res] = await this.$http.post('user/bindEmail',{
					user_id:this.User.userinfo.id,
					email:this.email
				})
				if(!err){
					if(res.data.code==200){
						uni.showToast({
							title:'绑定成功',
							icon:'none',
							success: () => {
								this.User.userinfo.email = this.email;
								uni.setStorageSync("userinfo",this.userinfo);
								setTimeout(()=>{
									uni.navigateBack({ delta: 1 });
								},1000)
							}
						})
					}else{
						uni.showToast({
							title:'绑定失败',
							icon:'none'
						})
						this.loading = false;
						this.disabled = false;
					}
				}else{
					uni.showToast({
						title:'绑定失败',
						icon:'none'
					})
					this.loading = false;
					this.disabled = false;
				}
			}
		}
	}
</script>

<style>
	.user-resetpwd {
		padding: 0 10upx;
	}

	.user-resetpwd button {
		width: 84%;
		margin: 30upx auto;
		background: #ffe933;
		color: #333333;
	}

	.user-set-logout-dis {
		background: #f4f4f4 !important;
		color: #999 !important;
	}

	.uni-input {
		padding-left: 30upx;
		height: 60upx;
		border-bottom: 1upx solid #eee;
		font-size: 32upx;
	}
</style>
