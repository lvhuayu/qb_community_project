(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/topic-detail/topic-detail"],{"0315":function(t,e,n){"use strict";n.r(e);var i=n("3cbd"),a=n("3b15");for(var o in a)"default"!==o&&function(t){n.d(e,t,function(){return a[t]})}(o);n("c52c");var r=n("2877"),u=Object(r["a"])(a["default"],i["a"],i["b"],!1,null,null,null);e["default"]=u.exports},"0706":function(t,e,n){"use strict";(function(t){n("78d4"),n("921b");i(n("66fd"));var e=i(n("0315"));function i(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,n("6e42")["createPage"])},"3b15":function(t,e,n){"use strict";n.r(e);var i=n("8a3b"),a=n.n(i);for(var o in i)"default"!==o&&function(t){n.d(e,t,function(){return i[t]})}(o);e["default"]=a.a},"3cbd":function(t,e,n){"use strict";var i=function(){var t=this,e=t.$createElement;t._self._c},a=[];n.d(e,"a",function(){return i}),n.d(e,"b",function(){return a})},"8a3b":function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i=a(n("a34a"));function a(t){return t&&t.__esModule?t:{default:t}}function o(t,e){return s(t)||u(t,e)||r()}function r(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function u(t,e){var n=[],i=!0,a=!1,o=void 0;try{for(var r,u=t[Symbol.iterator]();!(i=(r=u.next()).done);i=!0)if(n.push(r.value),e&&n.length===e)break}catch(s){a=!0,o=s}finally{try{i||null==u["return"]||u["return"]()}finally{if(a)throw o}}return n}function s(t){if(Array.isArray(t))return t}function c(t,e,n,i,a,o,r){try{var u=t[o](r),s=u.value}catch(c){return void n(c)}u.done?e(s):Promise.resolve(s).then(i,a)}function l(t){return function(){var e=this,n=arguments;return new Promise(function(i,a){var o=t.apply(e,n);function r(t){c(o,i,a,r,u,"next",t)}function u(t){c(o,i,a,r,u,"throw",t)}r(void 0)})}}var d=function(){return n.e("components/topic/topic-info").then(n.bind(null,"e83a"))},f=function(){return n.e("components/index/swiper-tab-head").then(n.bind(null,"f1f1"))},p=function(){return n.e("components/common/common-list").then(n.bind(null,"f2b6"))},h=function(){return n.e("components/common/load-more").then(n.bind(null,"87e2"))},m={components:{topicInfo:d,swiperTabHead:f,commonList:p,loadMore:h},data:function(){return{topicInfo:{topicBg:"../../static/demo/15611049029292019-6-21web3_4.jpg",titleImg:"../../static/demo/1568986634772user1.jpg",title:"#忆往事，敬余生#",totalnum:650,todaynum:233,introduce:"面试官：在电梯里巧遇马云你会做什么？90后女孩回答被当场录用"},tabIndex:0,tabBars:[{name:"默认",id:"defut"},{name:"最新",id:"new"}],tabList:[{loadMoreText:"上拉加载更多",list:[],page:1},{loadMoreText:"上拉加载更多",list:[],page:1}]}},onLoad:function(e){this.__initDate(JSON.parse(e.detailTopic)),t.$on("updateData",this.updateDate)},onReachBottom:function(){this.loadMore()},onPullDownRefresh:function(){this.getData()},methods:{__initDate:function(e){t.setNavigationBarTitle({title:e.title}),this.topicInfo={id:e.id,topicBg:e.titleimg,titleImg:e.titleimg,title:e.title,totalnum:650,todaynum:233,introduce:e.introduce},this.getList()},tabtap:function(t){this.tabIndex=t,this.tabList[this.tabIndex].page,this.getList()},getList:function(){var t=l(i.default.mark(function t(){var e,n,a,r,u,s,c,l,d,f,p;return i.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return e="index/topicPost?id=".concat(this.topicInfo.id,"&page=").concat(this.tabList[this.tabIndex].page,"&user_id=").concat(this.User.userinfo.id),t.next=3,this.$http.get(e);case 3:if(n=t.sent,a=o(n,2),a[0],r=a[1],u=r.data,200!=u.code){t.next=29;break}for(this.tabList=[{loadMoreText:"上拉加载更多",list:[],page:1},{loadMoreText:"上拉加载更多",list:[],page:1}],s=!0,c=!1,l=void 0,t.prev=13,d=u.data[Symbol.iterator]();!(s=(f=d.next()).done);s=!0)p=f.value,this.tabList[this.tabIndex].list.push(this.listFormat(p));t.next=21;break;case 17:t.prev=17,t.t0=t["catch"](13),c=!0,l=t.t0;case 21:t.prev=21,t.prev=22,s||null==d.return||d.return();case 24:if(t.prev=24,!c){t.next=27;break}throw l;case 27:return t.finish(24);case 28:return t.finish(21);case 29:u.data.length<10?this.tabList[this.tabIndex].loadMoreText="没有更多糗事了~":this.tabList[this.tabIndex].loadMoreText="上拉加载更多~";case 30:case"end":return t.stop()}},t,this,[[13,17,21,29],[22,,24,28]])}));function e(){return t.apply(this,arguments)}return e}(),getData:function(){this.getList(),t.stopPullDownRefresh()},loadMore:function(){"上拉加载更多~"==this.tabList[this.tabIndex].loadMoreText&&(this.tabList[this.tabIndex].loadMoreText="加载中...",this.tabList[this.tabIndex].page++,this.getList())},listFormat:function(t){return{id:t.id,user_id:t.user_id,username:t.user[0].username,userimg:t.user[0].userpic,isFocus:t.fans.length,title:t.title,titleimg:t.titlepic,content:t.content,age:t.user[0].age,sex:t.user[0].sex,path:t.user[0].path,type:t.type,post_class_id:t.post_class_id,isopen:t.isopen,infonum:{index:t.support?t.support.type+1:0,upnum:t.upnum,downnum:t.downnum},imgList:t.imgList,fans:t.fans,commentnum:t.commentnum,upnum:t.upnum,sharenum:t.sharenum}},updateDate:function(t){switch(t.type){case"onFocus":this.updateFocus(t);break}},updateFocus:function(t){var e=!0,n=!1,i=void 0;try{for(var a,o=this.tabList[this.tabIndex].list[Symbol.iterator]();!(e=(a=o.next()).done);e=!0){var r=a.value;r.user_id==t.user_id&&(r.isFocus=t.data)}}catch(u){n=!0,i=u}finally{try{e||null==o.return||o.return()}finally{if(n)throw i}}}}};e.default=m}).call(this,n("6e42")["default"])},a96d:function(t,e,n){},c52c:function(t,e,n){"use strict";var i=n("a96d"),a=n.n(i);a.a}},[["0706","common/runtime","common/vendor"]]]);