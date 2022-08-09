class people{
    constructor(name) {
        this.name = name;
    }
    sayname(){
        console.log(this.name);
    }
};
let xiaoming = new people("xiaoming");
xiaoming.sayname();// xiaoming
//pyq全部列表
const newList = document.querySelector("#newsList");
let pyqListArr = []; //储存朋友圈列表的信息   可以通过数据库形式存储，方便以后的操作
//发送朋友圈信息
const toPYQPage = document.querySelector(".toPYQPage");
//朋友圈界面
const sendPYQPage = document.querySelector("#sendPYQPage");
//取消发送朋友圈的按钮
const cancelSend = document.querySelector(".cancelSend");
//朋友圈复写框
const PYQtext = document.querySelector(".PYQtext");
//发表内容的按钮
const sendPYQ = document.querySelector(".sendPYQ");
//朋友圈加载图片
const picurl = document.querySelector("#picurl");
//点击事件代理
const addPic = document.querySelector(".addPic");
//点击的图片数组
let picUrlValue = [];
//填入到choosePic中
const choosePic = document.querySelector(".choosePic ul");
//朋友圈写入的内容
let PYQTextValue = "";
// 构造朋友圈对象
class PYQLIST {
	constructor(dataName, userHeadImg, newOwnerName, userTextContain, userPicAndVideo, elem, time, zanListArr = [],
		commendTextListArr = []) {
		this.dataName = dataName; //用户名称
		this.userHeadImg = userHeadImg; //用户头像
		this.newOwnerName = newOwnerName; //用户网名
		this.userTextContain = userTextContain; //用户朋友圈的文本
		this.userPicAndVideo = userPicAndVideo; //用户朋友圈的图片或者视频
		this.time = new Date() - time; //时间
		this.zanListArr = zanListArr; //把所有赞的人的列表储存在数组中
		this.commendTextListArr = commendTextListArr //评论的列表 列表以数组的形式添加
		this.elem = elem; //元素的节点  创建的时候将创建的元素 作为参数传入
		this.myCommendText = ""; //评论内容
		this.commendWho = ""; //评论谁
		this.wantDelect = -1;
	}
	//对象的方法
	//初始化
	init() {
		this.randonElem();
		//渲染elem元素
		//操作完将元素插入到newlist中
		newList.appendChild(this.elem)
		//初始化的函数找到元素节点
		//评论区contain
		this.commendContain = this.elem.querySelector(".commendContain")
		//赞列表
		this.zanList = this.elem.querySelector(".zanList")
		//bottomLine元素的渲染
		this.bottomLine = this.elem.querySelector(".bottomLine")
		//谁赞了文本
		this.whoZanList = this.elem.querySelector(".whoZanList")
		//评论内容
		this.commendTextList = this.elem.querySelector(".commendTextList")
		//点点框
		this.choic = this.elem.querySelector(".choic");
		//选项框
		this.commendChoic = this.elem.querySelector(".commendChoic");
		//选项
		this.choicList = this.elem.querySelector(".choicList")
		//评论框
		this.commendInput = this.elem.querySelector(".commendInput");
		//评论input
		this.inputElem = this.elem.querySelector(".inputConatin");
		//遮罩和删除样式
		this.deleteContain = this.elem.querySelector("#deleteContain")
		//删除 取消按钮
		this.deleteCommend = this.elem.querySelector("#deleteCommend")
		//加入元素
		this.pushToZanList()
		this.pushToCommendList()
		//设置样式
		this.showCommendContain()
//事件监听begin
		// 点击图片列表事件
		// 点击图片放大事件
		// this.picAndVideoContainBox.addEventListener("click",(e)=>{
		// 	e = e||window.event;
		// 	const elem = e.target;
		// 	if(elem.parentElement.dataset.index){//点击到了一个图片
		// 		// 将图片的索引保存
		// 		//获取图片的高度
		// 		elem.style.position = "fixed";
				
		// 		elem.style.width = "100%";
		// 		elem.style.height = "300px";
		// 		elem.style.zindex = 100
		// 		// window.clientHeight
		// 		elem.style.left = 0;
		// 		elem.style.top = (window.innerHeight - 300)/2 + "px";
				
				
		// 	}
		// })
		//点点框点击事件
		this.choic.addEventListener("click", () => { //箭头函数改变this指向
			setTimeout(()=>{
				this.commendChoic.style.display = "block"
			},1)
			
		})
		//选项框点击事件
		this.choicList.addEventListener("click", (e) => {
			e = e || window.event;
			e.cancelBubble = true
			//精确找到元素节点
			const element = e.target.className ? e.target : e.target.parentElement;
			if (element == this.choicList.children[0]) {
				//赞
				// 判断原理啊有没有赞过
				if (element.className == "zan") {
					//没赞过
					element.className = "quxiao";
					element.children[1].innerHTML = "取消"
					console.log(this.zanListArr)
					this.zanListArr.push({
						ID: "我",
						user: "self"
					});
				} else {
					//赞过
					element.className = "zan";
					element.children[1].innerHTML = "赞"
					this.zanListArr = this.zanListArr.filter(item => item.user != "self")
				}
				this.pushToZanList()
				//向this.zanListArr添加元素
			} else {
				//点击评论
				//判断可以发送否
				this.commendInput.style.display = "flex";
				this.inputElem.setAttribute("placeholder", "点我评论鸭~")
				//获取评论input
				this.inputElem = this.elem.querySelector(".inputConatin");
				this.inputElem.focus();
			}
			//点击过后将选项框隐藏
			this.commendChoic.style.display = "none"
			//重新设置样式
			this.showCommendContain()
		})
		//点击发送评论事件
		this.commendInput.children[1].addEventListener("click", (e) => {
			e = e || window.event;
			e.cancelBubble = true
			if (this.commendInput.children[1].className == "canSend") {
				if (this.commendWho == "") {
					this.commendTextListArr.push({
						IDname: "我",
						text: this.myCommendText,
						user: "self",
						index: Math.random() * 100000000
					})
				} else {
					this.commendTextListArr.push({
						IDname: "我",
						text: this.myCommendText,
						user: "self",
						index: Math.random() * 100000000,
						method: this.commendWho
					})
					//重置this.commendWho
					this.commendWho = ""
				}
				//将input的样式等取消掉
				this.commendInput.style.display = "none";
				this.inputElem.value = ""
				this.myCommendText = "";
				this.commendInput.children[1].className = "cannotSend"
				this.pushToCommendList();
			}
			this.showCommendContain()
		})
		//滑动评论框事件
		this.commendInput.addEventListener("touchmove", (e) => {
			e = e || window.event;
			e.cancelBubble = true
		})
		//评论input的点击事件
		this.commendInput.addEventListener("click", (e) => {
			e = e || window.event;
			e.cancelBubble = true
		})
		//评论内容的点击事件
		this.commendTextList.addEventListener("click", (e) => {
			//精确找到元素节点
			let element = (e.target.className == "other" || e.target.className == "self") ? e.target : e.target.parentElement;
			//判断是自己的评论内容还是别人的评论内容
			if (element.className == "self") {
				this.wantDelect = element.dataset.index;
				console.log(this.wantDelect)
				this.deleteContain.style.display = "block"
			} else if (element.className == "other") {
				//是别人的
				setTimeout(()=>{
					this.commendInput.style.display = "flex";
				},1)
				
				const commendPeopleName = element.children[0].children[0].innerHTML;
				this.inputElem.setAttribute("placeholder", "回复" + commendPeopleName);
				this.commendWho = commendPeopleName;
				this.inputElem.focus();
			}

		})
		//点击遮罩的事件
		this.deleteCommend.addEventListener("click", (e) => {
			e = e || window.event;
			if (e.target.className == "deleteChoic") {
				//遍历查找这条朋友圈
				this.commendTextListArr = this.commendTextListArr.filter(item => item.index != this.wantDelect)
				//重新渲染
				this.pushToCommendList()
				//设置样式
				this.showCommendContain()
				this.deleteContain.style.display = "none"
			} else if (e.target.className == "cancelChoic") {
				this.deleteContain.style.display = "none"
			}
		})
		//onkeydown事件
		this.inputElem.addEventListener("keyup", (e) => {
			e = e || window.event;
			this.myCommendText = this.inputElem.value;
			if (this.myCommendText == "") {
				this.commendInput.children[1].className = "cannotSend"
			} else {
				this.commendInput.children[1].className = "canSend"
			}
		})
		//点击body事件
		document.querySelector("body").addEventListener("click", () => {
			this.commendChoic.style.display = "none";
			this.commendInput.style.display = "none";
		})
		document.querySelector("body").addEventListener("touchmove", () => {
			this.commendChoic.style.display = "none";
			this.commendInput.style.display = "none";
		})
//事件监听end
	}
	// 初始化渲染elem
	randonElem() {
		// 给父元素加一个类名
		this.elem.classList.add("news");
		//innerhtml
		//一开始没有人赞就将元素display none
		this.elem.innerHTML =
			`
		<!-- 这里放固定的标签 -->
		<div id="deleteContain">
			<div class="zhezhao"></div>
			<div id="deleteCommend">
				<div class="deleteChoic">删除</div>
				<div class="cancelChoic">取消</div>
			</div>
		</div>
		<!-- 这里放内容 -->
			<div class="userContain">
				<div class="userHeadImg"><img src="${this.userHeadImg}"></img></div>
				<div class="otherContain">
					<h5 class="newsOwnerName">${this.newOwnerName}</h5>
					<div class="userTextContain">${this.userTextContain}</div>
					<div class="userPicAndVideoContain"><ul class="picAndVideoContainBox"></ul></div>
					<div class="dateAndChoic">
						<span class="date">${this.time}分钟前</span>
						<div class="choic"><span class="point"></span><span class="point"></span></div>
						<div class="commendChoic" style="display: none;">
							<div class="choicList">
								<div class="zan"><img src="img/赞%20(1).png"> <span>赞</span></div>
								<div class="pinglun"><img src="img/评%20论%20(1).png"> 评论</div>
							</div>
						</div>
					</div>
					<div class="commendContain">
						<div class="zanList">
							<img src="img/点赞.png">
							<div class="whoZanList"></div>
						</div>
						<div class="bottomLine" ></div>
						<div class="commendList">
							<ul class="commendTextList">
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div class="bottomLine"></div>
			<div class="commendInput" style="display: none;"><input autofocus="autofocus" class="inputConatin" type="text" placeholder="" /><div class="cannotSend">发送</div></div></div>
		`
		//
		//添加元素
		// 存放图片的元素盒子
		this.picAndVideoContainBox = this.elem.querySelector(".picAndVideoContainBox");
		//循环将数组内容填入
		for (let index in this.userPicAndVideo) {
			const item = this.userPicAndVideo[index]
			const li = document.createElement("li");
			li.dataset.index = index;
			li.innerHTML = `<img src="${item}"></img>`;
			this.picAndVideoContainBox.appendChild(li);
		}
	}
	//判断评论去的显示情况
	showCommendContain() {
		//都没有，整个都不显示
		if (this.zanListArr.length == 0 && this.commendTextListArr.length == 0) {
			this.commendContain.style.display = "none";
		} else {
			this.commendContain.style.display = "flex";
			if (this.zanListArr.length != 0) {
				this.zanList.style.display = "flex"
			} else {
				this.zanList.style.display = "none"
			}
		}
	}

	//向赞列表添加元素
	pushToZanList() {
		let that = this;
		this.whoZanList.innerHTML = "";
		//循环将列表添入元素中
		for (let index in this.zanListArr) {
			const item = this.zanListArr[index];
			//创建一个span元素
			const span = document.createElement("span");
			//span加className
			span.innerHTML = item.ID;
			if (index < this.zanListArr.length - 1) {
				span.innerHTML += ","
			}
			// 添加到whozanlist中
			that.whoZanList.appendChild(span)
		}
	}
	//向评论列表填入
	pushToCommendList() {
		this.commendTextList.innerHTML = "";
		for (let item of this.commendTextListArr) {
			//创建一个li元素
			const li = document.createElement("li");
			li.dataset.index = item.index;
			li.className = item.user
			if (item.method) {
				li.innerHTML =
					`<span ><span class="commenderName">${item.IDname}</span> 回复 <span class="commenderName">${item.method}</span>:${item.text}</span>`
			} else {
				li.innerHTML = `<span ><span class="commenderName">${item.IDname}：</span>${item.text}</span>`
			}

			this.commendTextList.appendChild(li)
		}
	}
}