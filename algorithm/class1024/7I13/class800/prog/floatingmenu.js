// JavaScript Document
//更換快選單圖示用
function changeimage(tp){
	var img1=new Image();
	var img2=new Image();
	img1.src="images/tag01.gif";
	img2.src="images/tag00.gif";
	if(tp==1) findObj("ImageMenu01").src=img1.src;
	if(tp==2) findObj("ImageMenu01").src=img2.src;
}
//設定FloatingMenu display
function FloatingMenuDisplay(strId) {
	var obj=findObj(strId);
	if(obj) {
		if(obj.style.display=="block") {
			obj.style.display="none";
			changeimage(1);
		} else {
			obj.style.display="block";
			changeimage(2);
		}
	}
}
//CreatFloatingMenu
function CreatFloatingMenu(){
	//var arrMenuData=new Array();
	//設定圖層位置
	findObj("Layer5").style.top="140px";
	findObj("Layer5").style.left="470px";
	var i, strTitle, strHtml1="";	
	strHtml1="<table border=\"1\" align=\"left\"  bordercolor=\"#999999\"  cellpadding=\"0\" cellspacing=\"0\">";
	for(i=0; i<arrMenuData.length; i++) {
		strTitle=arrMenuData[i];
	//alert(strTitle);
		if(i==0) {
			strHtml1+='	<tr>';
			strHtml1+='		<td height="17" align="left" valign="middle" bgcolor="#FFE1C4"><a href="#0'+i.toString()+'" title="'+strTitle+'" class="style1">'+strTitle+'</a></td>';
			strHtml1+='</tr>';
		} else {
			strHtml1+='	<tr>';
			strHtml1+='		<td height="17" align="left" valign="middle" bgcolor="#FFFFE8"><a href="#'+i.toString()+'" title="'+strTitle+'" class="style1">'+strTitle+'</a></td>';
			strHtml1+='</tr>';
		}
		
	}
	strHtml1+="</table>";
	if(findObj("FloatingMenuTd")) {
		findObj("FloatingMenuTd").innerHTML=strHtml1;
	}
}



	