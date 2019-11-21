import User from './user.js';
import Config from './config.js';
import Time from './time.js';
export default {
	url:Config.webSocketURL,
	IsOpen:false,//连接状态
	SocketTask:false,//连接信息
	IsOnline:false,//用户是否上线、用户身份验证后绑定客户端
	//当前聊天对象
	CurToUser:{
		user_id:0,//通过判断用户id是否为0判断用户当前场景
		username:'',
		userpic:'',
	},
	//打开连接
	Open(){
		if(this.IsOpen) return;
		this.SocketTask = uni.connectSocket({
			url:this.url,
			complete: (e) => {}
		});
		if(!this.SocketTask) return;
		this.SocketTask.onOpen(()=>{
			//将连接状态设为已连接
			this.IsOpen = true;
			//用户绑定
			this.UserBind();
		});
		//监听信息
		this.Message();
		//监听关闭
		this.SocketTask.onClose(()=>{
			this.IsOpen =false;
			this.SocketTask =false;
		});
		//监听错误
		this.SocketTask.onError(()=>{
			this.IsOpen = false;
			this.SocketTask = false;
			uni.showToast({
				title:'Socket 连接错误~'
			})
		});
	},
	//绑定用户
	UserBind(){
		let user = User.userinfo
		this.SocketTask.send({
			data:JSON.stringify(user)
		});
	},
	Message(){
		this.SocketTask.onMessage((e)=>{
			let res = JSON.parse(e.data);
			//更改状态
			this.IsOpen = true;
			//接收信息格式
			// {
			// 	to_id:1,//接收用户id
			// 	from_id:2,//发送用户id
			// 	from_username:"ddd",
			// 	from_userpic:'url',
			// 	type:'text',
			// 	data:'你好啊',//发送的信息
			// 	time:1511515151,//时间戳
			// }
			if(res.type !== 'text') return;//
			//全局通知接口
			uni.$emit('UserChat',res);
			//接收到信息后，存储到chatdetail<聊天信息详情>
			this.__UpdateChatDetail(res);//与某个用户的聊天信息
			this.__UpdateChatList(res);//与哪些人的聊天界面信息
			//总未读数+1，修改tabbar信息
			if(this.CurToUser.user_id !== res.from_id){
				this.__UpdatenoReadNum({type:'add'});
			}
			//获取未读总数，并渲染到tabbarde badeg<脚标信息>
			//获取未读信息
		})
	},
	//初始化未读数
	initTabbarBadeg(){
		let noReadNum = uni.getStorageSync('noReadNum'+User.userinfo.id);
		if(noReadNum>0){
			return uni.setTabBarBadge({
				index:Config.TabbarIndex,//底部导航栏的索引
				text:noReadNum > 99 ? '99+' : noReadNum.toString()  //显示的为读书，接收String信息
			});
		}
		return uni.removeTabBarBadge({
			index:Config.TabbarIndex
		})
	},
	//更新chatdetail		//<是不是发送信息↓，调用场景不同>
	__UpdateChatDetail(res,isSend = false){
		// 页面信息格式，本地存储
		/** 
		{
		 	inFrom:true,//好友发的为false
			user_id:17,
		 	userimg:"../../static/demo/1568986634772user1.jpg",
		 	type:"text",
		 	chatData:"给我发张图片吧！",
		 	chatTime:"1570595120",
		 },
		 **/
		let user_id = isSend ? this.CurToUser.user_id : res.from_id;
		//获取历史聊天记录  <chatDetail_14[当前用户id]_21[聊天对象id]>
		let list = uni.getStorageSync('chatDetail_' + User.userinfo.id + '_' + user_id);
		list = list ? JSON.parse(list) : [];
		//最新消息追加
		list.push(this.__format(res,{
			type:'chatdetail',
			inFrom:isSend,
			olddata:list,
		}));
		uni.setStorage({
			key:'chatDetail_' + User.userinfo.id + '_' + user_id,
			data:JSON.stringify(list)
		})
	},
	//更新chatlist
	__UpdateChatList(){
		let chatlist = uni.getStorageSync('chatlist'+User.userinfo.id);
		chatlist = chatlist ? JSON.parse(chatlist) : [];
		//判断是否已存在该会话，存在会话置顶，不存在，追加头部
		let index = chatlist.findIndex((item)=>{
			return item.user_id == res.to_id || item.user_id == res.from_id;
		})
		//不存在
		if(index==-1){
			let obj = this.__format(res,{type:'chatlist'});
			//忽觉本人发送
			if(res.from_id !== User.userinfo.id){
				obj.noReadNum =1;
			}
			chatlist.unshift(obj)
		}else{
			//存在
			chatlist[index].data = res.data;
			chatlist[index].type = res.type;
			chatlist[index].time = res.time;
			// 当前聊天对象不是该id，未读数+1（排除本人发送消息）
			if (res.from_id !== User.userinfo.id && this.CurToUser.userid !== chatlist[index].user_id) {
				chatlist[index].noReadNum++;
			}
			// 置顶当前会话
			chatlist = this.__toFirst(chatlist,index);
		}
		// 存储到本地存储
		uni.setStorage({
			key:'chatlist'+User.userinfo.id,
			data:JSON.stringify(chatlist)
		})
	},
	//关闭连接
	Close(){
		if(this.IsOpen){
			this.SocketTask.close();
			//移除未读信息总数角标
			return uni.removeTabBarBadge({
				index:Config.TabbarIndex
			})
		}
	},
	__format(data,options={}){
		/**
		 options = {
			 type:"chatdetail", // 转化类型
			 olddata:olddata,   // 旧数据（chatdetail中必填）
			 inFrom:true			// （true本人，false聊天对象，chatdetail中必填）
		 }
		 * */
		switch (options.type){
			case "chatlist":// 新增会话用到
			let obj = {
				user_id:data.from_id,
				userpic:data.from_userpic,
				username:data.from_username,
				time:data.time, // 最新消息时间戳
				data:data.data,
				noReadNum:0		 // 未读数
			};
			// 本人发送的信息
			if (data.from_id == User.userinfo.id) {
				obj.user_id = this.CurrentToUser.user_id;
				obj.userpic = this.CurrentToUser.userpic;
				obj.username = this.CurrentToUser.username;
			}
			return obj;
				break;
			case "chatdetail":
			let list = options.olddata; // 旧数据
			let chattime = new Date().getTime();  // 获取当前时间
			let length = list.length;
			return {
				inFrom:options.inFrom,
				userpic:options.inFrom ? User.userinfo.userpic : data.from_userpic,
				type:data.type,
				data:data.data,
				time:chattime,
				gstime:Time.gettime.getChatTime(chattime,(length > 0) ? list[length-1].time : 0)
			};
				break;
			case "send":
			return {
				to_id:this.CurrentToUser.user_id,
				from_id:User.userinfo.id,
				from_username:User.userinfo.username,
				from_userpic:User.userinfo.userpic,
				type:data.type,
				data:data.data,
				time:new Date().getTime()
			}
				break;
		}
	},
	// 数组置顶
	__toFirst(arr,index){
		if (index != 0) {
			arr.unshift(arr.splice(index,1)[0]);
		}
		return arr;
	}
}
