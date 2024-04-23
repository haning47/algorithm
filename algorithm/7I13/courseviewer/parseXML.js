function Resource(_id, _scormtype, _href) {
	this.id=(typeof(_id)!="undefined") ? _id:""; 
	this.type="webcontent";
	this.scormType=(typeof(_scormtype)!="undefined") ? _scormtype:"asset"; 
	this.href=(typeof(_href)!="undefined") ? _href:"";	
}
function Resources() {
	this.resources=new Array(); 
	this.qty=0; 
}
Resources.prototype.addResource = function(_id, _scormtype, _href) {
	this.resources[this.qty]=new Resource(_id, _scormtype, _href);
	this.qty++;
	return this.resources[this.qty-1];
}
Resources.prototype.findResource = function(_id) {
	for(var i=0; i<this.qty; i++) {
		if(this.resources[i].id==_id) {			
			return this.resources[i];	
		}
	}
	return null;
}
function Item(_id, _rid, _title, _level, _isvisible, _parent_id, _pre_id, _next_id) {
	this.id=(typeof(_id)!="undefined")?_id:""; 
	this.rid=(typeof(_rid)!="undefined")?_rid:""; 
	this.isVisible=(typeof(_isvisible)!="undefined")?_isvisible:"";
	this.title=(typeof(_title)!="undefined")?_title:"";
	this.parentId=(typeof(_parent_id)!="undefined")?_parent_id:"";
	this.preId=(typeof(_pre_id)!="undefined")?_pre_id:"";; 
	this.nextId=(typeof(_next_id)!="undefined")?_next_id:"";; 
	this.items=new Array(); 
	this.qty=0; 	
	this.level=(typeof(_level)!="undefined")?_level:0;	
	this.readyState=0;
	this.lessonStatus=0;	
}
Item.prototype.addItem = function(_id, _rid, _title, _level, _isvisible, _parent_id, _pre_id, _next_id) {
	this.items[this.qty]=new Item(_id, _rid, _title, _level, _isvisible, _parent_id, _pre_id, _next_id);
	this.qty++;
	return this.items[this.qty-1];		
}
Item.prototype.findItem = function(_id) {
	for(var i=0; i<this.qty; i++) {
		if(this.items[i].id==_id) {
			return this.items[i];	
		}
	}	
	return null;
}
Item.prototype.copyProperty = function(_source) {
	this.id=_source.id;
	this.rid=_source.rid;
	this.isVisible=_source.isVisible;
	this.title=_source.title;	
	this.parentId=_source.parentId;	
	this.preId=_source.preId;
	this.nextId=_source.nextId;
	this.qty=_source.qty;	
	this.level=_source.level;	
	this.readyState=_source.readyState;
	this.lessonStatus=_source.lessonStatus; 
}
Item.prototype.printMenu = function(_div_obj) {
	var id=this.id, href=this.href, title=this.title, qty=this.qty;
	var shtml="", dep=1, i, div_menu, div_submenu;
	for(i=1; i<this.level; i++) {
		dep+=20;
	}
	
	//選單Div
	div_menu=document.createElement("div");
	div_menu.setAttribute("id", id);
	div_menu.setAttribute("name", id);
	div_menu.setAttribute("title", title);
	div_menu.setAttribute("width", "100%");		
	//選單鏈結
	shtml+="<table width='100%' border='0' cellspacing='0' cellpadding='0'><tr><td width='"+dep+"px' nowrap>&nbsp;</td><td>";
	shtml+="<a href='javascript:;' onClick='goClass(\""+id+"\", \""+href+"\");'>";
	shtml+="<div id='TOC_"+id+"' name='TOC_"+id+"' class='"+((id==global["curMenuId"])?global["menuFocusStyle"]:global["menuStyle"])+"' title='"+title+((qty>0)?" \n└─ 具有 "+qty.toString()+" 個子選單":"")+"'";
	shtml+=" onMouseOver='javascript:if(\""+id+"\"!=global[\"curMenuId\"])this.className=\""+global["menuOverStyle"]+"\";'";
	shtml+=" onMouseOut='javascript:if(\""+id+"\"!=global[\"curMenuId\"]) this.className=\""+global["menuStyle"]+"\"'>"+title+"</div></a></td></tr></table>";
	div_menu.innerHTML=shtml;	
	_div_obj.appendChild(div_menu);	
	//alert(_div_obj.innerHTML);
	if(qty>0) { //有子選單
		div_submenu=document.createElement("div");
		div_submenu.setAttribute("id", id+"_submenu");
		div_submenu.setAttribute("name", id+"_submenu");
		div_submenu.setAttribute("width", "100%");		
		_div_obj.appendChild(div_submenu);
		if(id==global["curMenuId"]) {
			document.getElementById(id+"_submenu").style.display="";
		} else {
			document.getElementById(id+"_submenu").style.display="none";
		}
		//建立子選單
		for(i=0; i<qty; i++) {			
			this.items[i].printMenu(document.getElementById(id+"_submenu"));	
		}
	}	
}
function Org(_id, _title) {
	this.id=_id;
	this.structure="";
	this.title=_title; 
	this.items=new Array(); 
	this.qty=0; 
}
Org.prototype.addItem = function(_id, _rid, _title, _level, _visible, _parent_id, _pre_id, _next_id) {
	this.items[this.qty]=new Item(_id, _rid, _title, _level, _visible, _parent_id, _pre_id, _next_id);
	this.qty++;
	return this.items[this.qty-1];	
}
Org.prototype.findItem = function(_id) {
	for(var i=0; i<this.qty; i++) {
		if(this.items[i].id==_id) {
			return this.items[i];	
		}	
	}	
	return null;
}
Org.prototype.printMenu = function() {
	var shtml="";
	for(var i=0; i<this.qty; i++) {
		shtml+=this.items[i].printMenu();	
	}
	return shtml;
}
function Orgs() {
	this.defaultOrgId="";
	this.orgs=new Array();
	this.qty=0;
}
Orgs.prototype.addOrg = function(_id, _title) {
	this.orgs[this.qty]=new Org(_id, _title);
	this.qty++;
	return this.orgs[this.qty-1];
}
Orgs.prototype.findOrg = function(_id) {
	for(var i=0; i<this.qty; i++) {
		if(this.orgs[i].id==_id) {
			return this.orgs[i];	
		}	
	}
	return null;
}
Orgs.prototype.printMenu = function(_id) {
	var shtml="";
	for(var i=0; i<this.qty; i++) {		
		if(this.orgs[i].id==_id) {
			shtml+=this.orgs[i].printMenu();
			return shtml;
		}
	}
	return shtml;
}
function Aggregation() {
	this.version="scorm1.2";
	this.xmldoc=null;
	this.manifestId="";
	this.orgsList=new Orgs();
	this.ress=null;	
	this.learnStatus=null;
	this.levelPos=1;	
	/*
	if (document.implementation && document.implementation.createDocument) {
		this.xmldoc=document.implementation.createDocument("", "", null);
		this.xmldoc.onload=function() { that.parseAgg(); }
		//xmldoc.load(url);
	} else if(window.ActiveXObject) {
		this.xmldoc=new ActiveXObject("Microsoft.XMLDOM");
		this.xmldoc.onreadystatechange=function() {
			alert(this.readystate);
			if(this.readyState==4) { that.parseAgg(); }
		}
		//xmldoc.load(url);			
	}
	*/
}
Aggregation.prototype.loadXml = function(_url) {
	//this.xmldoc.async = false;
	//this.xmldoc.validateOnParse = false;
	this.xmldoc.load(_url);
	/*
	if (this.xmldoc.parseError.errorCode != 0) {
   	var myErr = this.xmldoc.parseError;
   	alert("課程架構檔解析錯誤，錯誤訊息： " + myErr.reason);
	}
	*/	
}
Aggregation.prototype.parseAgg = function() {
	var root=this.xmldoc.getElementsByTagName("manifest");
	var nodelist=root[0].childNodes;
	var shtml="",item, orgs=null;	
	//this.manifestId=root.getAttribute("identifier").replace("-", "_");
	this.manifestId=root[0].getAttribute("identifier").split("-").join("_");	
	//this.learnStatus=this.getLearnStatus("userData");
	for (var i=0; i<nodelist.length; i++) {
    	item = nodelist.item(i);
    	if(item.nodeType==1) {
      		if(item.nodeName.toLowerCase()=="organizations") {      	     	
      			orgs=item;      	      	
      		} else if(item.nodeName.toLowerCase()=="resources") {      	      	
    			this.ress=item;
    		}
		}
	}
  	if(this.ress!=null && orgs!=null) {
  		shtml+=this.parseRess(this.ress);
  		shtml+=this.parseOrgs(orgs);
  	}	
	return shtml;
}
Aggregation.prototype.parseRess = function (_ress) {
	var i, id, scormtype, href, res, shtml="";
	if(_ress.hasChildNodes) {
		this.ress=new Resources();
		for(i=0; i<_ress.childNodes.length; i++) {
			res=_ress.childNodes[i];
			if(res.nodeType==1) {
				id=res.getAttribute("identifier").split("-").join("_");				
				href=res.getAttribute("href");
				scormtype=res.getAttribute("adlcp:scormtype");
				this.ress.addResource(id, scormtype, href);
				shtml+="["+id+","+scormtype+","+href+"]<br>";
			}
		}
	} else {
		alert("課程資源(resources)有問題，請修正。");
	}
	return shtml;
}
Aggregation.prototype.parseOrgs = function(_orgs) {
	if(!_orgs.hasChildNodes) {
		alert("課程架構有問題，請修正。");
		return false;
	}
	var org_list=_orgs.childNodes, i, j, find_default_org=false;	
	var shtml="", id, org, title=null, neworg;
	this.orgsList.defaultOrgId=_orgs.getAttribute("default").split("-").join("_");
	for(var i=0; i<org_list.length; i++) {
		org=org_list[i];
		if(org.nodeType==1) {
			id=org.getAttribute("identifier").split("-").join("_");
			if(id==this.orgsList.defaultOrgId) {
				find_default_org=true;
				shtml+=id+",<br>";
				if(org.hasChildNodes) {
					for(j=0; j<org.childNodes.length; j++) {
						if(org.childNodes[i].nodeType==1 && org.childNodes[i].nodeName.toLowerCase()=="title") {						
							title=org.childNodes[i].firstChild.data;
							break;
						}
					}
					title=(title!=null) ? title:"資料有誤";
					neworg=this.orgsList.addOrg(id, title);			
					shtml+=this.parseOrg(org, neworg);					
				} else {
					alert("預設的課程架構(default organization)有問題，請修正。");
					return false;
				}
				break;
				//i=org_list.length;
			}
		}
	}
	if(!find_default_org) {
		alert("找不到預設的課程架構(default organization)，請修正。");
		return false;
	}
	return shtml;
}
Aggregation.prototype.parseOrg = function(_org, _new_org) {
	var node_item=_org.childNodes;
	var shtml="", new_item;
	//從org尋找item	
	for(var i=0; i<node_item.length; i++) {	
		if(node_item[i].nodeType==1 && node_item[i].nodeName.toLowerCase()=="item") {		
			new_item=_new_org.addItem();
			this.levelPos=1; 
			shtml+=this.parseItem(node_item[i], new_item, "");			
		}
	}	
	return shtml;	
}
Aggregation.prototype.parseItem = function(_item, _new_item, _parent_id) {
	var shtml="",id="",title="",level="", rid="", parent_id="", is_visible="", res=null;
	var href="", child_item=null, new_item, dep="";
	var pre_id="", next_id="", i, j;
	id=_item.getAttribute("identifier").split("-").join("_");
	rid=_item.getAttribute("identifierref");
	if(rid) {
		rid=rid.split("-").join("_");
	} else {
		rid="";
	}
	is_visible=_item.getAttribute("isvisible");
	for(i=0; i<_item.childNodes.length; i++) {
		if(_item.childNodes[i].nodeType==1 && _item.childNodes[i].nodeName=="title") {
			title=_item.childNodes[i].firstChild.data;
			break;
		}
	}	
	title=(title!=null) ? title:"資料有誤";	
	parent_id=_parent_id;
	res=this.ress.findResource(rid);
	if(res!=null) {
		href=res.href;
		if(href!="") href=href;		
	}
	level=this.levelPos;	
	_new_item.id=id; 
	_new_item.rid=rid; 	
	_new_item.parentId=parent_id; 
	_new_item.isVisible=is_visible; 
	_new_item.title=title; 
	_new_item.level=level; 
	_new_item.href=href;
	for(i=1; i<=_new_item.level; i++) {
		dep+="　";
	}		
	shtml+=dep+"["+_new_item.id+","+_new_item.rid+","+_new_item.isVisible+","+_new_item.title+","+_new_item.level+","+_new_item.href+"]<br>";
	
	if(_item.hasChildNodes) {
		this.levelPos++;
		child_item=_item.childNodes;
		for(i=0; i<child_item.length; i++) {
			if(child_item[i].nodeType==1 && child_item[i].nodeName.toLowerCase()=="item") {			
				new_item=_new_item.addItem(); 
				shtml+=this.parseItem(child_item[i], new_item, _new_item.id);
			}
		}
		this.levelPos--;
	}
	return shtml;
}
Aggregation.prototype.getLearnStatus = function(_tp) {
	switch(_tp) {
		case "cookie": 
			return getCookie(this.manifestId);
		case "userData": 
			if(typeof(parent.parent.LoadLearnStatus)!="undefined") {
				return parent.parent.LoadLearnStatus("DemoCourse", this.mainfestId);	
			} else if(typeof(LoadLearnStatus)!="undefined") {
				return LoadLearnStatus("DemoCourse", this.mainfestId);	
			} 
			return null;	
		case "flash": 
			return null;			
		default:
			return null;
	}
}
Aggregation.prototype.printUnit = function(_div_obj) {
	var default_org=this.orgsList.orgs[0];
	//alert(default_org.id);
	this.printMenu(default_org, _div_obj);
}

Aggregation.prototype.printMenu = function(_org, _div_obj) {	
	var i, title1;
	for(i=0; i<_org.qty; i++) {
		if(i==0) {
			global["curMenuId"]=_org.items[i].id;
			global["defaultUrl"]=_org.items[i].href;
		}
		//alert(_org.items[i].id);
		_org.items[i].printMenu(_div_obj);
		title1=document.getElementById("titleDiv")
		if(title1!=null) {
			title1.innerHTML=_org.title;
		}
	}
}

