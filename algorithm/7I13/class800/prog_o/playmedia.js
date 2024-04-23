//=============================================================================
//=== Filename : playmedia.js
//=== Function : for 1024x768 courses 
//=== Version  : 2005/04
//=============================================================================
var open_wid;
//播放老師教講，不另開視窗，適用 800x600 的.asf 媒體檔
function showvideo(p) { 
	window.focus();
	var turl="../prog_o/1024x768.htm?purl="+p.replace("../../media/", "media/");	
  location.href=turl;   
}
//播放老師教講，另開新視窗，適用 1024x768 的.asf 媒體檔
function showvideop(p) {
	window.focus();
	try{ if(!open_wid.closed) open_wid.close(); } catch(e){}
  open_wid=window.open("../prog_o/1024x768p.htm?purl="+p.replace("../../media/", "media/"),"playwindow","left=0,top=0,height=740,width=1015,status=no,toolbar=no,menubar=no,location=no,scrollbars=no,resizable=no");
  open_wid.focus();
}
//播放老師教講，另開視窗，適用 800x600 的.asf 媒體檔
function showvideop2(p) { 
	window.focus();
	try{ if(!open_wid.closed) open_wid.close(); } catch(e){}
	var turl="../prog_o/1024x768p-2.htm?purl="+p.replace("../../media/", "media/");	   
  open_wid=window.open(turl,"","left=0,top=0,height=647,width=827,status=no,toolbar=no,menubar=no,location=no,scrollbars=no,resizable=no");
  open_wid.focus();   
}
//播放老師教講，另開新視窗，適用 1024x768 的.asf 媒體檔
function showvideop3(p) {
	window.focus();
	try{ if(!open_wid.closed) open_wid.close(); } catch(e){}
  open_wid=window.open("../prog_o/1024x768p2.htm?purl="+p.replace("../../media/", "media/"),"playwindow","left=0,top=0,height=740,width=1015,status=no,toolbar=no,menubar=no,location=no,scrollbars=no,resizable=no");
  open_wid.focus();
}
//播放老師教講、步驟導引或互動習作(CP製作的)，不另開視窗，適用 800x600 的.swf 檔
function showguide(p) {
	window.focus();
	var turl="../prog_o/1024x768guide.htm?purl="+p.replace("../../media/", "media/");	
	location=turl;
}
//播放導引式課程(viewlet製作的)，不另開視窗，適用 800x600 的.swf 檔
function showguide2(p) {
	window.focus();
	var turl="../prog_o/1024x768guide-2.htm?purl="+p;	
	location=turl;
}
//播放老師教講、步驟導引或互動習作(CP製作的)，不另開視窗，適用 800x600 的.swf 檔(無關閉按鈕)
function showguide3(p) {
	window.focus();
	var turl="../prog_o/1024x768guide3.htm?purl="+p.replace("../../media/", "media/");	
	location=turl;
}
//播放老師教講、步驟導引或互動習作(CP製作的)，另開視窗，適用 1024x768 的.swf 檔
function showguidep(p) {
	window.focus();
	try{ if(!open_wid.closed) open_wid.close(); } catch(e){}
	open_wid=window.open("../prog_o/1024x768guidep.htm?purl="+p.replace("../../media/", "media/"),"playwindow","left=0,top=0,height=740,width=1015,status=no,toolbar=no,menubar=no,location=no,scrollbars=no,resizable=no");
  	open_wid.focus();
}
//播放老師教講、步驟導引或互動習作(CP製作的)，另開視窗，適用 800x600 的.swf 檔
function showguidep2(p) {
	window.focus();
	try{ if(!open_wid.closed) open_wid.close(); } catch(e){}
	var turl="../prog_o/1024x768guidep-2.htm?purl="+p.replace("../../media/", "media/");	
	open_wid=window.open(turl,"","left=0,top=0,height=647,width=827,status=no,toolbar=no,menubar=no,location=no,scrollbars=no,resizable=no");
  open_wid.focus(); 
}
//播放互動習作(CP製作的)，另開視窗，適用1024x768 的.swf檔
function showswfp(p) {
	window.focus();
	try{ if(!open_wid.closed) open_wid.close(); } catch(e){}
	open_wid=window.open("../prog_o/1024x768guidep.htm?purl="+p.replace("../../media/", "media/"),"playwindow","left=0,top=0,height=740,width=1015,status=no,toolbar=no,menubar=no,location=no,scrollbars=no,resizable=no");
  	open_wid.focus();
}

//播放動畫呈現，另開新視窗，適用 400x300 的.asf/.wmv/.avi 媒體檔
function showsample(p) { 
	window.focus();
	try{ if(!open_wid.closed) open_wid.close(); } catch(e){}
   open_wid=window.open("../prog_o/400x300sample.htm?purl="+p.replace("../../media/", "media/"),"playwindow","left=0,top=0,height=370,width=410,status=no,toolbar=no,menubar=no,location=no,scrollbars=no,resizable=no");
   open_wid.focus();
}

//播放老師教講，另開新視窗(CS製作)，適用 1024x768 的.swf 媒體檔(上移23px)
function showswfp2(p) {
	window.focus();
	try{ if(!open_wid.closed) open_wid.close(); } catch(e){}
	var turl="../prog_o/1024x768swfp2.htm?purl="+p.replace("../../media/", "media/")+",frate:"+frate; 
	open_wid=window.open(turl,"","left=0,top=0,height=732,width=1015,status=no,toolbar=no,menubar=no,location=no,scrollbars=no,resizable=no");
	open_wid.focus();
}

//播放老師教講，另開新視窗(CS製作)，適用 1024x768 的.swf 媒體檔(上移23px，左移5px)
function showswfp3(p) {
	window.focus();
	try{ if(!open_wid.closed) open_wid.close(); } catch(e){}
	var turl="../prog_o/1024x768swfp3.htm?purl="+p.replace("../../media/", "media/")+",frate:"+frate; 
	open_wid=window.open(turl,"","left=0,top=0,height=732,width=1015,status=no,toolbar=no,menubar=no,location=no,scrollbars=no,resizable=no");
	open_wid.focus();
}

//播放老師教講，另開新視窗(CS製作)，適用 1024x768 的.swf 媒體檔(控制bar自動隱藏，上移5px)
function showswfp5(p) {
	window.focus();
	try{ if(!open_wid.closed) open_wid.close(); } catch(e){}
	var turl="../prog_o/1024x768swfp5.htm?purl="+p.replace("../../media/", "media/")+",frate:"+frate; 
	open_wid=window.open(turl,"","left=0,top=0,height=732,width=1015,status=no,toolbar=no,menubar=no,location=no,scrollbars=no,resizable=no");
	open_wid.focus();
}

//播放老師教講，不另開新視窗(CS製作)，適用 800x600 的.swf 媒體檔
function showswf2(p) {
	window.focus();
	var turl="../prog_o/1024x768swf2.htm?purl="+p.replace("../../media/", "media/")+",frate:"+frate; 
	location=turl;
}

//播放老師教講，不另開新視窗(CS製作)，適用 800x600 的.swf 媒體檔(無關閉按鈕，上移12px)
function showswf3(p) {
	window.focus();
	var turl="../prog_o/1024x768swf3.htm?purl="+p.replace("../../media/", "media/")+",frate:"+frate; 
	location=turl;
}

//播放老師教講，不另開新視窗(CS製作)，適用 800x600 的.swf 媒體檔(控制bar自動隱藏)
function showswf4(p) {
	window.focus();
	var turl="../prog_o/1024x768swf4.htm?purl="+p.replace("../../media/", "media/")+",frate:"+frate; 
	location=turl;
}

//播放老師教講，另開新視窗(CS製作)，適用 800x600 的.swf 媒體檔(控制bar自動隱藏)
function showswf5(p) {
	window.focus();
	try{ if(!open_wid.closed) open_wid.close(); } catch(e){}
	var turl="../prog_o/1024x768swf5.htm?purl="+p.replace("../../media/", "media/")+",frate:"+frate; 
  open_wid=window.open(turl,"","left=0,top=0,height=647,width=827,status=no,toolbar=no,menubar=no,location=no,scrollbars=no,resizable=no");
  open_wid.focus();
}

//播放實作演練，不另開視窗(CP製作)，適用 800x600 的.swf 媒體檔
function showtest(p) {
	window.focus();
	var turl="../prog_o/1024x768test.htm?purl="+p.replace("../../media/", "media/");	
	location=turl;
}

//播放實作演練，另開視窗(CP製作)，適用 1024x768 的.swf 媒體檔
function showtestp(p) {
	window.focus();
	try{ if(!open_wid.closed) open_wid.close(); } catch(e){}
	open_wid=window.open("../prog_o/1024x768testp.htm?purl="+p.replace("../../media/", "media/"),"playwindow","left=0,top=0,height=740,width=1015,status=no,toolbar=no,menubar=no,location=no,scrollbars=no,resizable=no");
   open_wid.focus();
}

//開啟成果展示(初始樣本)頁面
function showhtml(sp) {
	window.focus();
	try{ if(!open_wid.closed) open_wid.close(); } catch(e){}
	var p=sp.split(",");
	open_wid=window.open(p[0], "", "left=0,top=0,height="+p[2]+",width="+p[1]+",status=no,toolbar=no,menubar=no,location=no,scrollbars=no,resizable=no");
	open_wid.focus();
}

//播放成果展示(初始樣本)，另開視窗，適用320x240的 .wmv/.asf/.swf/.mp3媒體檔
function showfinal320(p) {	
	window.focus();
	try{ if(!open_wid.closed) open_wid.close(); } catch(e){}
	var _x=document.body.clientWidth, _y=document.body.clientHeight, _top=window.screenTop, _left=window.screenLeft, turl;
	if((_x-364)>1) _left+=parseInt((_x-364)/2);
	if(_y-296>1) _top+=parseInt((_y-296)/2);		
	if(p.indexOf(".wmv")!=-1 || p.indexOf(".asf")!=-1 || p.indexOf(".wma")!=-1) { //播放.wmv/.asf/.wma
		turl="../prog_o/320x240final_wmv.htm?purl="+p.replace("../../media/", "media/");
	} else if(p.indexOf(".swf")!=-1 || p.indexOf(".mp3")!=-1) { //播放.swf/.mp3
		turl="../prog_o/320x240final_swf.htm?purl="+p.replace("../../media/", "media/")+",frate:"+frate;
	}
	open_wid=window.open(turl, "","left="+_left+",top="+_top+",width=364,height=296,status=no,toolbar=no,menubar=no,location=no,scrollbars=no,resizable=no");
  open_wid.focus();
}

//播放成果展示(初始樣本)，另開視窗，適用640x480的 .wmv/.asf/.swf/.mp3媒體檔
function showfinal640(p) {	
	window.focus();
	try{ if(!open_wid.closed) open_wid.close(); } catch(e){}
	var _x=document.body.clientWidth, _y=document.body.clientHeight, _top=window.screenTop, _left=window.screenLeft, turl;
	if((_x-675)>1) _left+=parseInt((_x-675)/2);
	if(_y-538>1) _top+=parseInt((_y-538)/2);		
	if(p.indexOf(".wmv")!=-1 || p.indexOf(".asf")!=-1) { //播放.wmv/.asf
		turl="../prog_o/640x480final_wmv.htm?purl="+p.replace("../../media/", "media/");
	} else if(p.indexOf(".swf")!=-1 || p.indexOf(".mp3")!=-1) { //播放.swf/.mp3
		turl="../prog_o/640x480final_swf.htm?purl="+p.replace("../../media/", "media/")+",frate:"+frate;
	}
	open_wid=window.open(turl, "","left="+_left+",top="+_top+",width=675,height=538,status=no,toolbar=no,menubar=no,location=no,scrollbars=no,resizable=no");
  open_wid.focus();
}

//播放成果展示(初始樣本)，另開視窗，適用800x600的 .jpg/.swf(多個圖組合) 媒體檔
function showfinal800(p) {	
	window.focus();
	try{ if(!open_wid.closed) open_wid.close(); } catch(e){}
	var _x=document.body.clientWidth, _y=document.body.clientHeight, _top=window.screenTop, _left=window.screenLeft, turl;	
	if((_x-827)>1) {
		_left+=parseInt((_x-827)/2);
	} else {
		_left=827-_x+_left-4;
	}
	if(_y-675>1) {
		_top+=parseInt((_y-675)/2);		
	} else {
		if(_top!=top.screenTop) {
			_top=_top-(_top-top.screenTop)-29;			
		} else {
			_top=0;
		}
	}
	if(p.indexOf(".jpg")!=-1 || p.indexOf(".swf")!=-1) { //播放.jpg/.swf(多個圖組合)	
		turl="../prog_o/800x600final_jpg.htm?purl="+p.replace("../../media/", "media/");
	}
	open_wid=window.open(turl, "","left="+_left+",top="+_top+",width=827,height=675,status=no,toolbar=no,menubar=no,location=no,scrollbars=no,resizable=no");
  open_wid.focus();
}

//顯示大圖示
function showpicture(p) {
	window.focus();
	try{ if(!open_wid.closed) open_wid.close(); } catch(e){}
	var turl="../prog_o/showpicture01.htm?purl="+p;
	open_wid=window.open(turl, "", "left=0,top=0,width=100,height=100,status=no,toolbar=no,menubar=no,location=no,scrollbars=no,resizable=yes");
	open_wid.focus();	
}

//檢查大圖尺寸
function checkSize() {			
	if((objPicture.width >= 640)||((objPicture.height >= 639)&&(objPicture.width < 640))) {		
		objTemp.isok=1;
		objTemp.style.cursor="hand";
		//objTemp.style.cursor="url(../images_o/cursor/cursor01.cur)";
		objTemp.title="點圖觀看大圖";
		objTemp.onclick=openPicture;
	}
	objPicture.src="";
}
//顯示大圖
function openPicture() {
	showpicture(this.src.replace(".jpg", "big.jpg").replace(".gif", "big.gif").replace(".png", "big.png"));
}
