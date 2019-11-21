<script>
	export default {
		onLaunch: function() {
			//console.log('App Launch')
			//监听网络
			this.netLib.NetWork.On();
			//初始化用户状态
			this.User.__init();
		},
		onShow: function() {
			//console.log('App Show')
			//this.User.__init();
		},
		onHide: function() {
			//console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	/* 官方unicss */
	@import './common/uni.css';
	/* 引入自定义图标库 */
	@import './common/icon.css';
	/* css动画库 */
	@import './common/animate.css';
</style>
