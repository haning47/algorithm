//======================================================================================
//點小圖顯示大圖相關函數，瀏覽式頁面使用
//======================================================================================
var objPicture=new Image();
var objTemp;
//初始化
function initImg() {
	var i, obj2=document.images;
	for(i=0; i<obj2.length; i++) {
		//if((obj2[i].tagName.toLowerCase())=="img") {								
			obj2[i].isok=0;		
			obj2[i].onmouseover=checkImage;		
		//}
	}
}
//檢查大圖是否存在
function checkImage() {
	objTemp=this;	
	if(this.isok==0) {				
		objPicture.src=this.src.replace(".jpg", "big.jpg").replace(".gif", "big.gif").replace(".png", "big.png");
		objPicture.onload=checkSize;		
	}
}
