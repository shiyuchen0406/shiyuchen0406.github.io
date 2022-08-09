//	获取deletePic的元素
const deletePic = document.querySelector("#deletePicContain");
//	删除按钮
const deletePicBtn = document.querySelector("#deletePicContain .deleteChoic")
// 取消删除按钮
const cancelDeletePic = document.querySelector("#deletePicContain .cancelChoic")
//保存点击的图片的索引
let wantDelectPic = -1;// -1保证不会影响到操作
//加载图片事件
//创建完成
//添加入朋友圈列表
//1.点击发送朋友圈图标事件
toPYQPage.addEventListener("click", () => {
	sendPYQPage.style.top = 0
})
//2.朋友圈发送页面出现后的点击事件
cancelSend.addEventListener("click", () => {
	sendPYQPage.style.top = "100vh"
})
//3.1.朋友圈内容的输入事件
PYQtext.addEventListener("keyup", () => {
	PYQTextValue = PYQtext.value;
	if (PYQTextValue == "") {
		sendPYQ.id = "cannotSend"
	} else {
		sendPYQ.id = "canSend"
	}
})
//3.2.选择照片事件
picurl.addEventListener("change", function(e) {
	var file = picurl.files[0];
	if(file){//确保有选择文件
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function(e) {
			 // 文件内容不能重复
			 if(!(picUrlValue.some(item => item == e.target.result))){
				 // 添加到数组中
				 picUrlValue.push(e.target.result);
				 // 渲染到页面中
				 const li = document.createElement("li");
				 li.setAttribute("data-index",picUrlValue.length - 1)
				 li.innerHTML = `<img src="${e.target.result}" >`
				 choosePic.appendChild(li);
			 }
		};
	}
})
// 3.3删除照片事件
//点击图片
choosePic.addEventListener("click",(e)=>{
	e = e||window.event;
	let elem = e.target.parentElement;
	if(elem.dataset.index){//点击到了一个图片
		// 将图片的索引保存
		wantDelectPic = elem.dataset.index
		deletePic.style.display = "block";//浮现删除遮罩
	}
})
// 3.4点击到图片，选择删除或者取消删除
// 点击删除
deletePicBtn.addEventListener("click",()=>{
	const deleteOne = picUrlValue[wantDelectPic]
	picUrlValue = picUrlValue.filter(item => item != deleteOne)
	// 重新渲染图片
	choosePic.innerHTML = ""
	for (let index in picUrlValue) {
		const item = picUrlValue[index];
		const li = document.createElement("li");
		li.setAttribute("data-index",index)
		li.innerHTML = `<img src="${item}" >`
		choosePic.appendChild(li);
	}
	//点击完成将遮罩取消
	deletePic.style.display = "none";
	//初始化wantDelectPic
	wantDelectPic = -1;
})
// 点击取消
cancelDeletePic.addEventListener("click",()=>{
	//点击完成将遮罩取消
	deletePic.style.display = "none";
	//初始化wantDelectPic
	wantDelectPic = -1;
})
//4.输入内容，将内容传入数组中
sendPYQ.addEventListener("click", () => {
	// 获取当前时间
	let nowDate = new Date()
	if (sendPYQ.id == "canSend") {
		//可以发送
		const myPYQ = document.createElement("li")
		let pyq2 = new PYQLIST("黄思杰", "", "我", PYQTextValue, picUrlValue, myPYQ,nowDate)
		pyqListArr.unshift(pyq2)
		//取消其他样式
		sendPYQ.id = "cannotSend";
		PYQTextValue = "";
		picUrlValue = [];
		choosePic.innerHTML = ""
		PYQtext.value = "";
		sendPYQPage.style.top = "100vh"
	}
	// 每发送一次,重新渲染朋友圈
	for (let item of pyqListArr) {
		item.init()
	}
})
