<template>
	<view>
		<!-- 信息列表 -->
		<view class="user-info">
			<!-- 头像 -->
			<view class="info-item" @tap="changeUserImg()">
				<view class="item-name">头像</view>
				<view class="item-val">
					<image :src="userimg" mode="aspectFill" lazy-load></image>
				</view>
				<view class="item-icon">
					<view class="icon iconfont icon-arrow-right"></view>
				</view>
			</view>
			<!-- 昵称 -->
			<view class="info-item">
				<view class="item-name">昵称</view>
				<input class="item-val" type="text" v-model="username" />
				<view class="item-icon">
					<view class="icon iconfont icon-arrow-right"></view>
				</view>
			</view>
			<!-- 性别 -->
			<view class="info-item" @tap="changeUserOne('sex')">
				<view class="item-name">性别</view>
				<view class="item-val">{{sex}}</view>
				<view class="item-icon">
					<view class="icon iconfont icon-arrow-right"></view>
				</view>
			</view>
			<!-- 生日 -->
			<picker mode="date" :value="birthday" :start="startDate" :end="endDate" @change="bindDateChange">
				<view class="info-item">
					<view class="item-name">生日</view>
					<view class="item-val">{{birthday}}</view>
					<view class="item-icon">
						<view class="icon iconfont icon-arrow-right"></view>
					</view>
				</view>
			</picker>
			<!-- 情感 -->
			<view class="info-item" @tap="changeUserOne('emon')">
				<view class="item-name">情感</view>
				<view class="item-val">{{emon}}</view>
				<view class="item-icon">
					<view class="icon iconfont icon-arrow-right"></view>
				</view>
			</view>
			<!-- 职业 -->
			<view class="info-item" @tap="changeUserOne('job')">
				<view class="item-name">职业</view>
				<view class="item-val">{{job}}</view>
				<view class="item-icon">
					<view class="icon iconfont icon-arrow-right"></view>
				</view>
			</view>
			<!-- 家乡 -->
			<view class="info-item" @tap="showMulLinkageThreePicker">
				<view class="item-name">家乡</view>
				<view class="item-val">{{home}}</view>
				<view class="item-icon">
					<view class="icon iconfont icon-arrow-right"></view>
				</view>
			</view>
		</view>
		<!-- 按钮 -->
		<view class="user-set-userinfo">
			<button class="user-set-logout" type="primary" @tap="submit">完成</button>
		</view>
		
		<mpvue-city-picker themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
		 @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
	</view>
</template>

<script>
	let sex = ['男', '女','不限'];
	let emon = ['单身贵族', '恋爱', '已婚'];
	let job = ['秘密', 'IT', '金融','管理'];
	import mpvueCityPicker from "../../components/mpvue-citypicker/mpvueCityPicker.vue";
	import Time from '../../common/time.js';
	export default {
		components:{
			mpvueCityPicker
		},
		data() {
			return {
				userimg: "",
				username: "",
				sex: "不限",
				emon: "未设置",
				job: "未设置",
				birthday: "未设置",
				home:"未知",
				cityPickerValueDefault: [0, 0, 1],//三级联动默认选中
			}
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		onLoad(e) {
			if(e.userinfo){
				let userinfo = JSON.parse(e.userinfo);
				this.userimg= userinfo.userpic || "https://ceshi2.dishait.cn//uploads/20190614/ea9a848e1db826bcc9a0fd9367867cc1.png"
				this.username= userinfo.username || "未设置"
				this.sex= sex[userinfo.userinfo.sex]  || "未设置"
				this.emon=emon[userinfo.userinfo.qg] || "未设置"
				this.job=job[userinfo.userinfo.job] || "未设置"
				this.birthday=userinfo.userinfo.birthday || "未设置"
				this.home=userinfo.userinfo.path || "未知"
			}else{
				this.userimg= "https://ceshi2.dishait.cn//uploads/20190614/ea9a848e1db826bcc9a0fd9367867cc1.png"
				this.username= "未设置"
				this.sex= "未设置"
				this.emon= "未设置"
				this.job= "未设置"
				this.birthday= "未设置"
				this.home="未知"
			}
		},
		
		methods: {
			//提交信息
			async submit() {
				uni.showLoading({title:'修改中'})
				let [err,res] = await this.$http.post('user/editUserInfo',{
					user_id:this.User.userinfo.id,
					user_name:this.username,
					sex:sex.indexOf(this.sex),
					qg:emon.indexOf(this.emon),
					job:job.indexOf(this.job),
					birthday:this.birthday,
					path:this.home,
					age:Time.gettime.getAgeByBirthday(this.birthday),
				})
				if(!err){
					uni.hideLoading()
					let data = res.data;
					if(data.code==200){
						let userinfo = data.data;
						this.User.userinfo = userinfo;
						this.User.token = userinfo.id;
						uni.setStorageSync("userinfo",this.userinfo);
						uni.setStorageSync("token", this.token);
						uni.showToast({ title:'修改完成' })
						uni.navigateBack({ delta: 1 });
					}else{
						uni.showToast({ title:'信息修改失败~' })
					}
				}else{
					uni.showToast({
						title:'修改失败',
						icon:'none'
					})
				}
			},
			//修改头像
			async changeUserImg() {
				 uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					success: (res) => {
						let filePath = res.tempFilePaths[0];
						uni.uploadFile({
							url:this.config.baseURL+'user/editUserImg', //仅为示例，非真实的接口地址
							filePath: filePath,
							name: 'file',
							formData: {
								'user_id': this.User.userinfo.id
							},
							success: (uploadFileRes) => {	
								let res =JSON.parse(uploadFileRes.data);
								 this.userimg = res.url;
							}
						});
					}
				})
				
				// uni.showLoading({title:'头像上传中'})
				//修改userinfo
			},
			//修改用户基础资料
			changeUserOne(val) {
				let arr = [];
				switch (val) {
					case 'sex':
						arr = sex;
						break;
					case 'emon':
						arr = emon;
						break;
					case 'job':
						arr = job;
						break;
				}
				uni.showActionSheet({
					itemList: arr,
					success: (res) => {
						switch (val) {
							case 'sex':
								this.sex = arr[res.tapIndex];
								break;
							case 'emon':
								this.emon = arr[res.tapIndex];
								break;
							case 'job':
								this.job = arr[res.tapIndex];
								break;
						}
					}
				})
			},
			//将选择的生日绑定到生日
			bindDateChange(e) {
				this.birthday = e.target.value
			},
			//格式化日期格式
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			//三级联动确认按钮
			onConfirm(e) {
				this.home = e.label
			},
			//三级联动选择
			showMulLinkageThreePicker() {
				this.$refs.mpvueCityPicker.show()
			},
			onBackPress() {
			  if (this.$refs.mpvueCityPicker.showPicker) {
			  	this.$refs.mpvueCityPicker.pickerCancel();
			    return true;
			  }
			},
			onUnload() {
				if (this.$refs.mpvueCityPicker.showPicker) {
					this.$refs.mpvueCityPicker.pickerCancel()
				}
			},
		},
		
	}
</script>

<style>
.user-set-userinfo {
	padding: 0 10upx;
}

.user-set-userinfo button {
	width: 84%;
	margin: 30upx auto;
	background: #ffe933;
	color: #333333;
}

.user-info {
	margin-top: 13upx;
	padding: 0 20upx;
}

.user-info .info-item:first-child {
	border-top: 1upx solid #eee;
	height: 120upx;
}

.user-info .info-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1upx solid #eee;
	height: 90upx;
}

.user-info .info-item .item-name {
	font-size: 32upx;
	font-weight: bold;
	color: #ccc;
	flex: 1;
}

.user-info .info-item .item-val {
	font-size: 29upx;
	color: #333;
	margin-right: 20upx;
	display: flex;
	align-items: center;
	text-align: right;
	max-width: 70%;
}

.user-info .info-item .item-val image {
	width: 80upx;
	height: 80upx;
	border-radius: 100%;
}

.user-info .info-item .item-icon>view {
	color: #ccc;
}
</style>
