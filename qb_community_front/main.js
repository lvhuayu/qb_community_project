import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

import config from "./common/config.js";
Vue.prototype.config = config;
App.mpType = 'app'
import netLib from "./common/netLib.js";
Vue.prototype.netLib = netLib;
import User from './common/user.js';
Vue.prototype.User = User;
import request from "./common/request.js";
Vue.prototype.$http = request;
import chat from "./common/chat.js";
Vue.prototype.$chat = chat;
const app = new Vue({
    ...App,
	config,
	netLib
})
app.$mount()
