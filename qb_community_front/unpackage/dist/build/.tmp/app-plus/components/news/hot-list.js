(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/news/hot-list"],{1080:function(t,e,i){},1834:function(t,e,i){"use strict";i.r(e);var n=i("feec"),a=i("777d");for(var o in a)"default"!==o&&function(t){i.d(e,t,function(){return a[t]})}(o);i("a7ff");var u=i("2877"),c=Object(u["a"])(a["default"],n["a"],n["b"],!1,null,"11fe7018",null);e["default"]=c.exports},5521:function(t,e,i){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i={props:{item:Object,index:Number,isChange:{type:Boolean,default:!1}},methods:{goTopicDetail:function(){if(this.isChange)return t.$emit("changeTopic",{id:this.item.id,title:this.item.title}),void t.navigateBack({delta:1});t.navigateTo({url:"../../pages/topic-detail/topic-detail?detailTopic=".concat(JSON.stringify(this.item))})}}};e.default=i}).call(this,i("6e42")["default"])},"777d":function(t,e,i){"use strict";i.r(e);var n=i("5521"),a=i.n(n);for(var o in n)"default"!==o&&function(t){i.d(e,t,function(){return n[t]})}(o);e["default"]=a.a},a7ff:function(t,e,i){"use strict";var n=i("1080"),a=i.n(n);a.a},feec:function(t,e,i){"use strict";var n=function(){var t=this,e=t.$createElement;t._self._c},a=[];i.d(e,"a",function(){return n}),i.d(e,"b",function(){return a})}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/news/hot-list-create-component',
    {
        'components/news/hot-list-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('6e42')['createComponent'](__webpack_require__("1834"))
        })
    },
    [['components/news/hot-list-create-component']]
]);                
