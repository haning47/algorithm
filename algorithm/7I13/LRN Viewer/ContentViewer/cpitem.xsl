<xsl:stylesheet language="javascript" xmlns:xsl="http://www.w3.org/TR/WD-xsl">
	<xsl:template match="/">
		<Root>
			<xsl:apply-templates select="" /> 
		</Root>
	</xsl:template>
	
	
	 <xsl:template match="item">
		<xsl:choose>
			<xsl:when test="//manifest/organizations/organization[@identifier = context(-1)/@identifierref]">
				<xsl:apply-templates select="//manifest/organizations/organization[@identifier = context(-1)/@identifierref]/item"/>
			</xsl:when>	 
		<xsl:otherwise>
		<ContentItem>
			<xsl:attribute name="Name"><xsl:value-of select="title" /></xsl:attribute>
			<xsl:attribute name="ID"><xsl:value-of select="@identifier" /></xsl:attribute>
			<xsl:attribute name="ResourceRef"><xsl:value-of select="@identifierref" /></xsl:attribute>
			<!-- <xsl:attribute name="Href"><xsl:value-of select="@identifierref" /></xsl:attribute> -->
			<xsl:attribute name="Href"><xsl:eval>GetFullPath(this)</xsl:eval></xsl:attribute>
						
			<xsl:choose >
				<xsl:when test="ancestor(item)" >
					<xsl:attribute name="ParentID"><xsl:value-of select="../@identifier" /></xsl:attribute>
				</xsl:when>
				<xsl:when test="ancestor(manifest)">
					<xsl:attribute name="ParentID"><xsl:eval>GetExternalManifestParentID(this)</xsl:eval></xsl:attribute>
				</xsl:when>
			</xsl:choose>
			
		    <xsl:attribute name="LessonStatus">not attempted</xsl:attribute>
			<xsl:attribute name="Prerequisites"><xsl:value-of select="adlcp:prerequisites" /></xsl:attribute>
			<xsl:attribute name="PrerequisitesMet">true</xsl:attribute>
			<xsl:attribute name="DataFromLMS"><xsl:value-of select="adlcp:datafromlms" /></xsl:attribute>

			<xsl:choose>
				<xsl:when  expr="HasChildren(this)">
						<xsl:attribute name="HasChildren">1</xsl:attribute>
						<xsl:choose>
							<xsl:when test="customsyllabusicons/parentnodecollapse">
								<xsl:attribute name="CloseIcon"><xsl:value-of select="customsyllabusicons/parentnodecollapse/@href"/></xsl:attribute>
							</xsl:when>
							<xsl:when test="/manifest/metadata/userinterface/customsyllabusicons/parentnodecollapse">
								<xsl:attribute name="CloseIcon"><xsl:value-of select="/manifest/metadata/userinterface/customsyllabusicons/parentnodecollapse/@href"/></xsl:attribute>		
							</xsl:when>
							<xsl:otherwise>
								<xsl:attribute name="CloseIcon">stdt_closebook.gif</xsl:attribute>
							</xsl:otherwise>
						</xsl:choose>
							
						<xsl:choose>
							<xsl:when test="customsyllabusicons/parentnodeexpand">
								<xsl:attribute name="OpenIcon"><xsl:value-of select="customsyllabusicons/parentnodeexpand/@href"/></xsl:attribute>
							</xsl:when>
							<xsl:when test="/manifest/metadata/userinterface/customsyllabusicons/parentnodeexpand">
								<xsl:attribute name="OpenIcon"><xsl:value-of select="/manifest/metadata/userinterface/customsyllabusicons/parentnodeexpand/@href"/></xsl:attribute>
							</xsl:when>
							<xsl:otherwise>
								<xsl:attribute name="OpenIcon">stdt_openbook.gif</xsl:attribute>
							</xsl:otherwise>
						</xsl:choose>
				</xsl:when>
				<xsl:otherwise>
					<xsl:attribute name="HasChildren">0</xsl:attribute>
					<xsl:choose>
						<xsl:when test="customsyllabusicons/leafnode">
							<xsl:attribute name="LeafIcon"><xsl:value-of select="customsyllabusicons/leafnode/@href"/></xsl:attribute>
						</xsl:when>
						<xsl:when test="/manifest/metadata/userinterface/customsyllabusicons/leafnode">
							<xsl:attribute name="LeafIcon"><xsl:value-of select="/manifest/metadata/userinterface/customsyllabusicons/leafnode/@href"/></xsl:attribute>
						</xsl:when>
						<xsl:otherwise>
							<xsl:attribute name="LeafIcon">stdt_pagebook.gif</xsl:attribute>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:otherwise>
		    </xsl:choose>
		</ContentItem>
	</xsl:otherwise>
	</xsl:choose>		
	</xsl:template>
	
	<xsl:template match="organization">
			<TocItem>
				<xsl:choose>
					<xsl:when test="//organizations[@default = context(-1)/@identifier]" >
						<xsl:attribute name="IsDefault">1</xsl:attribute>
					</xsl:when>
					<xsl:otherwise>
						<xsl:attribute name="IsDefault">0</xsl:attribute>
					</xsl:otherwise>
				</xsl:choose>
				<xsl:attribute name="Title"><xsl:value-of select="title" /></xsl:attribute>
				<xsl:attribute name="ID"><xsl:value-of select="@identifier" /></xsl:attribute>
			</TocItem>
	</xsl:template>

	<xsl:script language="javascript">
	<![CDATA[
		
	function GetFullPath(node)
	{
	// Constructs path to accommodate xml:base
	try
	{
		var strPath = "";
		if(!node) return (strPath);
		
		var strResourceBase = "";
		var strManifestBase = "";
		var strItemPath = "";
				
		var ResourceNode = node.parentNode;
		if(ResourceNode) 
		{				
			if (ResourceNode.getAttribute("xml:base"))
				strResourceBase = ResourceNode.getAttribute("xml:base") + "/";
				
			var ManifestNode = ResourceNode.parentNode;
			if(ManifestNode)
			{
				if (ManifestNode.getAttribute("xml:base"))
					strManifestBase = ManifestNode.getAttribute("xml:base") + "/";
			}
		}
		
		strItemPath = node.getAttribute("href");				
		var strPath = strManifestBase + strResourceBase + strItemPath;
	}
	catch(err)
	{
		alert ("Error in GetFullPath: " + err.description);
	}
	return strPath;		
	}
		
		function GetParentID(node, strNodeName)
		{
			if ( node )
			{
				if ( node.nodeName != strNodeName)
					 return (GetParentID (node.parentNode, strNodeName));
				else
					 return ( node.getAttribute("identifier"));
			
			}
			else
				return "";
		}
	
		
		function GetExternalManifestParentID(node)
		{
			try
			{
				var strNode = "";
			
				if(!node)
					return (strNode);
					
				var strManID =  GetParentID(node, "resources");
				var strOrgID =  GetParentID(node, "organization")
				var strRefID =   strManID + "/" + strOrgID ;
				
			
			
				var oNode = node.ownerDocument.selectSingleNode("//item[@identifierref='" + strRefID + "']");
			
				if (oNode)
					strNode = oNode.getAttribute("identifier");
				
			
				
			}
			catch(err)
			{
			}
			
			return strNode;
		}
		function HasChildren(oNode)
		{
			
			var sRes_ID = oNode.getAttribute("identifierref");
			var fRetVal = false;
			
			if (sRes_ID)
			{
				var oPath = sRes_ID.split("/");
			
				if (oPath.length > 1)
				{
					//we have a submanifest node.
					fRetVal = true;
				}
			}
			if (!fRetVal && oNode.selectSingleNode("item")) //maybe it has children.
				fRetVal = true;
			return ( fRetVal );
		}		

	]]>
	</xsl:script>
</xsl:stylesheet>