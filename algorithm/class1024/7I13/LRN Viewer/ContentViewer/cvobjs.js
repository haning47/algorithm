
function CViewerObj() 
 {
 		//////////////////////////////////////////////////////////////////////
		//PRIVATE VARIABLES.
		//
		//These vars are not exposed to public references of this object.
		//////////////////////////////////////////////////////////////////////
		
		//this xmldom is used to contain the entire course.
		var m_oXMLDOM    = new ActiveXObject("Msxml2.DOMDocument.3.0");
		var m_szCurrentNodeID = null;
		var m_oTimer = null;
		var m_strCurrentTOC = "";					//current toc index.
		var m_strCurrentManifest = "";
		var m_strXSLPath = "";				//path to resources.
		var m_ClassURL = "";
		var m_oLMSAPI = null;

		var enum_SELECT_SINGLEITEM = 0;
		var enum_SELECT_ITEMCHILDREN = 1;
		var enum_SELECT_TOCS = 2;
		var enum_SELECT_TOC = 3;
	
		var enum_CPO_PREVIOUS = 0;
		var enum_CPO_NEXT = 1;
		var enum_CPO_SELECT = 2;
		var enum_CPO_INIT = 3;
		var enum_CPO_LESSONSTATUS = 4;
		var enum_CPO_EXITSTATUS = 5;
		
		var LMSAPI_LESSONSTATUS = 200;
		var LMSAPI_EXITSTATUS = 300;
		
		var m_fIsReady = false;
		
		//////////////////////////////////////////////////////////////////////
		//PUBLIC METHODS.
		//
		//These methods are exposed to public references of this object.
		//////////////////////////////////////////////////////////////////////
	
		
		function CViewerObj.prototype.DoNext()
		{
			var szNodeID = m_szCurrentNodeID;
			var oNewCurrentNode = this.GetNext(szNodeID);

			//while(oNewCurrentNode != null)
			//{
				//if(oNewCurrentNode.selectSingleNode("Root/ContentItem[@PrerequisitesMet = 'true']"))
				//{
				//	m_szCurrentNodeID = oNewCurrentNode.documentElement.childNodes(0).getAttribute("ID");
				//	break;
				//}
				//oNewCurrentNode = this.GetNext(szNodeID);
			//}			

			if (oNewCurrentNode != null)
			{
				m_szCurrentNodeID = oNewCurrentNode.documentElement.childNodes(0).getAttribute("ID");
				mf_CreateEvent(enum_CPO_NEXT, m_szCurrentNodeID);
			}

			return ( oNewCurrentNode );
		}
		
		function CViewerObj.prototype.DoPrevious()
		{
			var szNodeID = m_szCurrentNodeID;
			var oNewCurrentNode = this.GetPrevious(szNodeID);

			//while(oNewCurrentNode != null)
			//{
			//	if(oNewCurrentNode.selectSingleNode("Root/ContentItem[@PrerequisitesMet = 'true']"))
			//	{
			//		m_szCurrentNodeID = oNewCurrentNode.documentElement.childNodes(0).getAttribute("ID");
			//		break;
			//	}
			//	oNewCurrentNode = this.GetPrevious(szNodeID);
			//}			

			if (oNewCurrentNode != null)
			{
				m_szCurrentNodeID = oNewCurrentNode.documentElement.childNodes(0).getAttribute("ID");
				mf_CreateEvent(enum_CPO_PREVIOUS, m_szCurrentNodeID)
			}
			
			return ( oNewCurrentNode );
		}
		
		function CViewerObj.prototype.DoSelect(id)
		{
	
			var oNewCurrentNode = this.GetItem(id);
			if((oNewCurrentNode != null) )
			//&& oNewCurrentNode.selectSingleNode("Root/ContentItem[@PrerequisitesMet = 'true']"))
			{
				m_szCurrentNodeID = id;
				if (m_oLMSAPI)
				{
					m_oLMSAPI.LRNSetScopedValue("cmi.core.entry", "resume", m_szCurrentNodeID, true);

					if (m_oTimer)
					{
						var strTimeDelta = m_oLMSAPI.LRNGetScopedValue("cmi.core.total_time", m_szCurrentNodeID, true);
						strTimeDelta = m_oTimer.CalculateNewTimeDelta(strTimeDelta);
						m_oLMSAPI.LRNSetScopedValue("cmi.core.total_time", strTimeDelta, m_szCurrentNodeID, true);
					}
				}
	
				//will need to fire event.
				mf_CreateEvent(enum_CPO_SELECT, m_szCurrentNodeID);
			}							
			return ( oNewCurrentNode );
		}
		
		function  CViewerObj.prototype.DoSelectFirst()
		{
			if (!m_oXMLDOM)
				return (null);
				
			var oXMLCurrentNode = null;
			var oNewCurrentNode = null;
			
			oXMLCurrentNode = m_oXMLDOM.documentElement.selectSingleNode("//organization[@identifier='" + m_strCurrentTOC + "']//item[0]");
			
			if (oXMLCurrentNode)			
				oNewCurrentNode = this.DoSelect(oXMLCurrentNode.getAttribute("identifier"))
				
			return ( oNewCurrentNode );			
		}
		
	
		
		function CViewerObj.prototype.GetCurrent()
		{
			return ( this.GetItem(m_szCurrentNodeID) );
		}
		
	
		//node retrieval methods.
		function CViewerObj.prototype.GetNext(id)  
		{
			
			if (!m_oXMLDOM)
				return (null);
			
			var oNode = null;
			var oNextNode = null;
			var oNewNode = null;
			var szID = null;
			
			//get the relative node.
			
			if(id != null)
			{
				oNode = mf_FindItem(id);
					
				if (oNode)
					oNextNode = mf_FindNext(oNode,true);
			}
			else //id is null. return the first node.
				oNextNode = m_oXMLDOM.selectSingleNode("//organization[@identifier='" + m_strCurrentTOC + "']//item[0]");
			
			
			if (oNextNode)
			{
				szID = oNextNode.getAttribute("identifier");
			
				if (szID != null)
					oNewNode = mf_TransformFromIMStoMLT(szID, enum_SELECT_SINGLEITEM);
			}
			
			return (oNewNode ) ;
		}

		function CViewerObj.prototype.GetPrevious(id)  
		{
			if (!m_oXMLDOM)
				return (null);
			
			var oNode = null;
			var oPrevNode = null;
			var oNewNode = null;
			var szID = null;
			
			//get the relative node.
			oNode = mf_FindItem(id);
			
			if (oNode)
				oPrevNode = mf_FindPrevious(oNode);
				
			if (oPrevNode)
			{
			
				szID = oPrevNode.getAttribute("identifier");
				
				if (szID != null)
					oNewNode = mf_TransformFromIMStoMLT(szID, enum_SELECT_SINGLEITEM) ;
			}
			
			return (oNewNode);
		}


		function CViewerObj.prototype.GetParent(id)
		{
			if (!m_oXMLDOM)
				return (null);
			
			var oParent = null;
			var oNewNode = null;
			var szID = null;		
		
			oParent = mf_FindParent(id);
				
			if (oParent)
			{
				szID = oParent.getAttribute("identifier") ;
				
				if (szID)
				{
					oNewNode = mf_TransformFromIMStoMLT(szID , enum_SELECT_SINGLEITEM);
				}
			}	
			
			return ( oNewNode ) ;
		}

		function CViewerObj.prototype.Init(urlClass,strLRNXML, strXSLPath, oLMSAPI)
		{
			try
			{
				mf_LoadXMLData(m_oXMLDOM,strLRNXML);
				m_strXSLPath = strXSLPath;
				m_ClassURL = urlClass;
				if("object" == typeof(oLMSAPI))
				{
					m_oLMSAPI = oLMSAPI;
				}

				//get the default table of contents.
				m_strCurrentTOC = m_oXMLDOM.selectSingleNode("manifest/organizations").getAttribute("default");
				
				if (!m_strCurrentTOC)
					m_strCurrentTOC = m_oXMLDOM.selectSingleNode("manifest/organizations/organization[0]").getAttribute("identifier");
				//create timer object.
				
				m_oTimer = new Timer();
			}
			catch(err)
			{
				//TODO: Add err.
			}
			
			mf_CreateEvent(enum_CPO_INIT, null);
			if (m_oLMSAPI)
			{
				m_oLMSAPI.LRNListenForEvents(mf_EventHandler);
			}
			m_fIsReady = true;
		}

		function CViewerObj.prototype.SetCurrentTOC(strCurrentTOCID)
		{
			if (strCurrentTOCID)
				m_strCurrentTOC  = strCurrentTOCID;
		}
		
		function CViewerObj.prototype.GetCurrentTOC()
		{
			if (!m_oXMLDOM)
				return (null);

			return ( mf_TransformFromIMStoMLT(m_strCurrentTOC, enum_SELECT_TOC));
		}

		function CViewerObj.prototype.GetTOCS()
		{
			if (!m_oXMLDOM)
				return (null);

			return ( mf_TransformFromIMStoMLT(null, enum_SELECT_TOCS));
		}
						
		function CViewerObj.prototype.GetChildren(id)
		{
			if (!m_oXMLDOM)
				return (null);
			return ( mf_TransformFromIMStoMLT(id, enum_SELECT_ITEMCHILDREN)) ;
		}
		
		function CViewerObj.prototype.GetItem(id)
		{
			if (!m_oXMLDOM)
				return (null);

			if (id != null)
				return ( mf_TransformFromIMStoMLT(id, enum_SELECT_SINGLEITEM));
		}

		function CViewerObj.prototype.IsReady()
		{
			return m_fIsReady;
		}
		
		function CViewerObj.prototype.GetCustomView()
		{
			if (!m_oXMLDOM)
				return (null);
				
			var strURL = "";
				
			 //check for the existance of the node that indicates a custom UI
			var node = m_oXMLDOM.selectSingleNode("//userinterface/customviewer/@href");
			
			if (null != node)
				strURL =  node.text;
			
			return strURL;
		}
		
		//////////////////////////////////////////////////////////////////////
		//PRIVATE METHODS.
		//
		//These methods are not exposed to public references of this object.
		//////////////////////////////////////////////////////////////////////
		
		function mf_CreateEvent(nType,sID)
		{
			var obj = new Object();
			obj.type = nType;
			obj.id = sID;
			
			if (m_oLMSAPI)
			{
				m_oLMSAPI.LRNRaiseEvent(obj);		
			}
		}
		
		function mf_FindParent(id)
		{
			if (!m_oXMLDOM)
				return (null);
			
			var oNode = null;
			var oParent = null;
			
			oNode = mf_FindItem(id);
			
			if (oNode)
				oParent = oNode.parentNode;
				
			return ( oParent );
		}
				
		function mf_FindItem(id)
		{
			if (!m_oXMLDOM)
				return (null);
				
			var oNode = null;

			if (id != null)
				oNode = m_oXMLDOM.selectSingleNode("//item[@identifier='" + id + "']");
			
			return (oNode);
		}
		
		function mf_GetItemInParentManifest(oNode)
		{
			var oParent = null;
			var szBase = oNode.getAttribute("identifier");

			while(true)
				{
				oNode = oNode.selectSingleNode("ancestor(manifestref)");
				if (oNode == null)
					break;
				szBase = oNode.getAttribute("identifier") + "/" + szBase;

				oParent = oNode.selectSingleNode("ancestor(manifest)/organizations//item[@resourceref='" + szBase + "']");
				if (oParent != null)
					break;
				}
			return oParent;
		}

		function mf_FindNext(oNode, fDescend)
		{
			if (!m_oXMLDOM)
				return (null);
				
			var oNext = null;

			if (fDescend && (mf_ResolveTOCNodeForNext(oNode) != oNode))
				oNext = mf_ResolveTOCNodeForNext(oNode);
			else if (fDescend && oNode.firstChild != null)
				oNext =  mf_ResolveTOCNodeForNext(oNode.firstChild);
			else if (oNode.nextSibling != null)
				oNext =  mf_ResolveTOCNodeForNext(oNode.nextSibling);
			else if (oNode.parentNode.nodeName == "item")
				oNext =  mf_FindNext(oNode.parentNode, false);
			else if (oNode.parentNode.nodeName == "organization")
			{
				var oParentItem = mf_GetItemInParentManifest(oNode.parentNode);
				if (oParentItem)
					oNext = mf_FindNext(oParentItem, false);
			}

			if (oNext)
			{
				if (oNext.nodeName != "item")
					oNext = mf_FindNext(oNext,false);
			}

			return oNext;
		}

		function mf_ResolveTOCNodeForNext(oNode)
		{
			if (!m_oXMLDOM)
				return (null);
				
			if (oNode.nodeName != "item")
				return oNode;
				
			var oResource = mf_ResourceFromItem(oNode);
		
			if (oResource == null)
				return oNode;
			else if (oResource.nodeName == "organization")
				return (oResource.childNodes[0]); // return the root. always an item.
			else
				return oNode;
		}
		
		function mf_FindPrevious(oNode)
		{
			if (!m_oXMLDOM)
				return (null);
			
			var oPrev = null;

			if (oNode.previousSibling != null)
			{
				oPrev = oNode.previousSibling;

				while (true)
				{
					oPrev = mf_ResolveTOCNodeForPrev(oPrev);

					if ((oPrev.nodeName == "item" || oPrev.nodeName == "organization") && oPrev.lastChild != null)
						oPrev = oPrev.lastChild;
					else
						break;
				}
			}
			else if (oNode.parentNode.nodeName == "item")
				oPrev = oNode.parentNode;
			else if (oNode.parentNode.nodeName == "organization")
			{
				var oParentItem = mf_GetItemInParentManifest(oNode.parentNode);
				if (oParentItem)
					oPrev = mf_FindPrevious(oParentItem);
			}

			if (oPrev)
			{
				if (oPrev.nodeName != "item")
					oPrev = mf_FindPrevious(oPrev);
			}

			return oPrev;
		}	
		
		
		function mf_ResolveTOCNodeForPrev(oNode)
		{
			if (!m_oXMLDOM)
				return (null);
				
			if (oNode.nodeName != "item")
				return oNode;
				
			var oResource = mf_ResourceFromItem(oNode);
		
			if (oResource == null)
				return oNode;		
			else if (oResource.nodeName == "organization")
				return oResource;
			else
				return oNode;
		}
		

						
		//this method is for transforming the returned node into our xml format.	
		//szID is the item identification which will establish context for the transformation.		
		function mf_TransformFromIMStoMLT(szID, enumValueType)
		{
			var oXSLNode   = null;
			var oXMLResult = null;
			
			
			//the XSL stylesheet.
			oXSLNode =  new ActiveXObject("Msxml2.DOMDocument.3.0");
			
			//the resulting transformation XML.
			oXMLResult  =  new ActiveXObject("Msxml2.DOMDocument.3.0");
			
			if (oXSLNode && oXMLResult)
			{

				try
				{
					mf_LoadXMLData(oXSLNode, m_strXSLPath );
					oXMLResult.async = false;
					oXMLResult.validateOnParse = false;
				}
				catch (err)
				{
						//TODO: Error Handling.
				}
			
				
				var szQuery = "//xsl:stylesheet//xsl:template//xsl:apply-templates"
				var oAppTemp = oXSLNode.selectSingleNode(szQuery);
				var szValue = "";
				
				switch (enumValueType)
				{
					case enum_SELECT_SINGLEITEM:
						szValue = "//item[@identifier='" + szID + "']";
						break;
					case enum_SELECT_ITEMCHILDREN:
					{
						//the children could be in another manifest.
						if (szID == null)
						{
							szValue = "//manifest[0]/organizations/organization[@identifier='" + m_strCurrentTOC + "']/item";
							break;
						}

						var oNode = mf_FindItem(szID);
						var oResource = mf_ResourceFromItem(oNode);
						
						if (oResource == null)
							szValue = "//item[@identifier='" + szID + "']/item";
						else
						{						
							if (oResource.nodeName == "organization")
								szValue = "//organization[@identifier='" + oResource.getAttribute("identifier") + "']/item";
							else
								szValue = "//item[@identifier='" + szID + "']/item";
						}
						break;
					}	
					case  enum_SELECT_TOCS:
						szValue = "/manifest[0]/organizations//organization";
						break;
						
					case  enum_SELECT_TOC:
						szValue ="/manifest[0]/organizations/organization[@identifier='" + szID + "']"	
						break;
				}
				
				oAppTemp.setAttribute("select", szValue);

				m_oXMLDOM.transformNodeToObject(oXSLNode, oXMLResult);
				
				if( enumValueType == enum_SELECT_ITEMCHILDREN || enumValueType == enum_SELECT_SINGLEITEM)
				{
					mf_SetProperties(oXMLResult);
				}
			}
			
			return ( oXMLResult );
		}	

		//helper function to load xml data.
		function mf_LoadXMLData(oXMLDOM, sXML)
		{
			if (oXMLDOM )
			{
				oXMLDOM.async = false;
				oXMLDOM.validateOnParse = false;
					
				if (false ==  oXMLDOM.load(sXML) )
				{
					alert(oXMLDOM.parseError.reason + " " + oXMLDOM.parseError.line);
				}
			}
		}

		function mf_SetLMSProps(node)
		{
			var strStatus = "";
			
			var strPrerequisites = node.getAttribute("Prerequisites");
			if (("string" == typeof(strPrerequisites)) && ("" != strPrerequisites))
			{
				// Currently we only support simple prerequisites
				if (m_oLMSAPI)
				{
					var strPrereqStatus = m_oLMSAPI.LRNGetScopedValue("cmi.core.lesson_status", strPrerequisites);
					if (("completed" == strPrereqStatus) || ("passed" == strPrereqStatus))
					{
						node.setAttribute("PrerequisitesMet", "true");
					}
					else
					{
						node.setAttribute("PrerequisitesMet", "false");
					}
				}				
			}
			else
			{
				node.setAttribute("PrerequisitesMet", "true");
			}

			//set datafromlms.
			if (m_oLMSAPI)
			{
				if (node.getAttribute("DataFromLMS"))
				{
					m_oLMSAPI.LRNSetScopedValue("cmi.launch_data", node.getAttribute("DataFromLMS"), node.getAttribute("ID"), true);
				}
			}
		}

		function mf_ResourceFromItem(item)
		{
			if (item == null)
				return null;

			var sIDRef = item.getAttribute("identifierref");
				
			if (sIDRef == null)
				return null;

			if (sIDRef == "")
				return null;

			// split the identifier into XPath-style notation
			var arr = sIDRef.split("/");

			// start navigating from the ancestor manifest
			var szQueryBase = "ancestor(manifest)";

			// Look into all submanifests, if any. Note that the last argument is not part of this loop.
			var i;
			for (i = 0; i < arr.length-1; i++)
				{
				//szQueryBase = szQueryBase + "/resources/manifestref[@identifier='" + arr[i] + "']/manifest";
				// no longer have manifestrefs
				szQueryBase = szQueryBase + "/manifest[@identifier='" + arr[i] + "']";
				}

			// Now, append the last argument as if it's a resource. Note that i==arr.length-1.
			var rsc = item.selectSingleNode(szQueryBase + "/resources/resource[@identifier='" + arr[i] + "']");
			if (rsc != null)
				{
				return rsc;
				}

			// No? Must be a TOC or junk. Treat it as a TOC; if it's junk, the null will pass through.
			var rsc = item.selectSingleNode(szQueryBase + "/organizations/organization[@identifier='" + arr[i] + "']");
			return rsc;
		}
		
		function mf_SetHref(node)
		{
			var szHref = "";
			var sIDRef = "";
			var rsc;
			var szQuery;

			if (node != null)
			{
				sIDRef = node.getAttribute("ResourceRef");
				
				if (sIDRef != "")
				{
					var arr = sIDRef.split("/");
					var szQuery = "//resources/resource[@identifier = '" + arr[arr.length-1] + "']";
					rsc = m_oXMLDOM.selectSingleNode(szQuery);

					if (rsc != null)
						szHref = rsc.getAttribute("href");

					// chrismof - get parameters attribute if present
					var sID = node.getAttribute("ID");
					szQuery = "//item[@identifier = '" + sID + "']";
					rsc = m_oXMLDOM.selectSingleNode(szQuery);
					if (rsc != null && rsc.getAttribute('parameters') != "")
						szHref += "?" + rsc.getAttribute("parameters");
				}
				else
					szHref = "LRN Viewer\\ContentViewer\\blank.htm";
			}

			if (szHref != null)
				node.setAttribute("Href", szHref);
			else
				node.setAttribute("Href","LRN Viewer\\ContentViewer\\blank.htm");			
		}	
			
		function mf_SetProperties(oXML)
		{
		
			var nLen = oXML.documentElement.childNodes.length;
			var node = null;
			var i;
			for (i = 0; i < nLen; i++)
			{
				node = oXML.documentElement.childNodes(i);
				
				mf_SetLMSProps(node);
				mf_SetHref(node);	//temporary until new storage model.
			}	
		}


		
		
		function mf_EventHandler(obj)
		{
			switch(obj.type)
			{
				case LMSAPI_LESSONSTATUS:
					mf_CreateEvent(enum_CPO_LESSONSTATUS, obj.id)
					break;
				case LMSAPI_EXITSTATUS:
					mf_CreateEvent(enum_CPO_EXITSTATUS, obj.id)
					break;
			}
		}
	
}

function ContentViewerEvtsObj()
{
	var enum_CPO_INIT = 3;
	var arrListeners = new Array();
	var oLMSAPI = null;
	var nNext = 0;
	
	function ContentViewerEvtsObj.prototype.Init(oAPI)
	{
		oLMSAPI = oAPI;
	}

    function ContentViewerEvtsObj.prototype.ListenForEvents(fnHandler)
    {
	   var oListener = new Object();
	   oListener.fnHandle = fnHandler;
	   arrListeners[nNext] = oListener;
	   nNext++;

	   if(null != oLMSAPI)
	   {
	      if(true == oLMSAPI.LRNIsReady())
		  {
		    var obj = new Object();
			obj.type = enum_CPO_INIT;
			obj.id = null;
			fnHandler(obj);
		  }
	   }  
    }
    
    function ContentViewerEvtsObj.prototype.UnListenForEvents(fnHandler)
    {
	  
	  	for (var i =0 ; i< arrListeners.length;i++)
	  	{
	  		if (arrListeners[i])
				if (arrListeners[i].fnHandle == fnHandler)
					 arrListeners[i] = null;
		 }
	 }	
    
	//arg contains event type and data.	
    function ContentViewerEvtsObj.prototype.RaiseEvent(arg)
    {
		for (var i =0 ; i< arrListeners.length;i++)
		{
				var obj = arrListeners[i];
				
				if (null != obj)
				obj.fnHandle(arg);
				
		}
	}	

}

// constructor
function Timer
(
)
{
	try
	{
		this.m_datetime = new Date();
		return this;
	}
	catch(e)
	{
		return null;
	}
}

// Return Value: none
function Timer.prototype.ResetTimer()
{
	try
	{
		this.m_datetime = new Date();
	}
	catch(e)
	{
	}
	return;
}

// Return Value: time delta in seconds
function Timer.prototype.GetTimeDelta()
{
	try
	{
		return Math.round( (new Date() - this.m_datetime) / 1000 );
	}
	catch(e)
	{
		return 0;
	}
}

// Return Value: time delta in seconds
function Timer.prototype.UnFormatTimeDelta (strTime)
{
	try
	{
		if("string" != typeof(strTime))
		{
			return 0;
		}
		
		var arrTime = strTime.split(":");
		if(3 != arrTime.length)
		{
			return 0;
		}

		var nHours = parseInt(arrTime[0]);
		var nMinutes = parseInt(arrTime[1]);
		var nSeconds = parseInt(arrTime[2]);
		if(	(true == isNaN(nHours))		||
			(true == isNaN(nMinutes))	||
			(true == isNaN(nSeconds))	)
		{
			return 0;
		}

		return (nHours * 60 * 60) + (nMinutes * 60) + nSeconds;
	}
	catch(e)
	{
		return 0;
	}
}

// Return Value: time delta as string
function Timer.prototype.FormatTimeDelta (nSeconds)
{
	try
	{
		if(("number" != typeof(nSeconds)) || (0 > nSeconds))
		{
			return "0:00:00";
		}

		// 1 hour = 60 minutes * 60 seconds 
		var nHours = Math.floor(nSeconds / (60 * 60));
		nSeconds = nSeconds - (nHours * 60 * 60);

		var nMinutes = Math.floor(nSeconds / 60);
		nSeconds = nSeconds - (nMinutes * 60);

		var strHours = nHours.toString();

		var strMinutes;
		if(10 > nMinutes)
		{
			// single digit
			strMinutes = "0" + nMinutes.toString();
		}
		else
		{
			strMinutes = nMinutes.toString();
		}

		var strSeconds;
		if(10 > nSeconds)
		{
			// single digit
			strSeconds = "0" + nSeconds.toString();
		}
		else
		{
			strSeconds = nSeconds.toString();
		}

		return strHours + ":" + strMinutes + ":" + strSeconds;
	}
	catch(e)
	{
		return "0:00:00";
	}
}

// Return Value: new time delta as string
function Timer.prototype.CalculateNewTimeDelta(strOldTimeDelta)
{
	try
	{
		var nTimeDelta = this.GetTimeDelta();
		this.ResetTimer();

		var nOldTimeDelta = this.UnFormatTimeDelta(strOldTimeDelta);
		var nNewTimeDelta = nTimeDelta + nOldTimeDelta;
		return this.FormatTimeDelta(nNewTimeDelta);
	}
	catch(e)
	{
		return strOldTimeDelta;
	}
}
