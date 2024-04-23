<xsl:stylesheet language="javascript" xmlns:xsl="http://www.w3.org/TR/WD-xsl">
	<xsl:template match="/">
		<xsl:for-each select="Root/ContentItem">
		<xsl:element name="div">
			<xsl:attribute name="name">Node</xsl:attribute>
			<xsl:attribute name="Href"><xsl:value-of select="@Href" /></xsl:attribute>
			<xsl:attribute name="NOWRAP">NOWRAP</xsl:attribute>		
			<xsl:attribute name="id"><xsl:value-of select="@ID" /></xsl:attribute>		
			<xsl:attribute name="HasChildren"><xsl:value-of select="@HasChildren" /></xsl:attribute>
			<xsl:attribute name="ParentID"><xsl:value-of select="@ParentID" /></xsl:attribute>
			<xsl:element name="div">
					<xsl:attribute name="name">Parent</xsl:attribute>
					<xsl:attribute name="id">__idParent</xsl:attribute>
					<xsl:attribute name="style">margin-bottom:5px;position:relative;cursor:hand</xsl:attribute>
					<xsl:choose>
						<xsl:when test="@CloseIcon">
							<xsl:element name="img">
								<xsl:attribute name="name">Item_Img</xsl:attribute>
								<xsl:attribute name="id">__idItem_Img</xsl:attribute>
								<xsl:attribute name="align">absmiddle</xsl:attribute>
								<xsl:attribute name="src"><xsl:value-of select="@CloseIcon"/></xsl:attribute>
								<xsl:attribute name="img_collapse"><xsl:value-of select="@CloseIcon"/></xsl:attribute>
								<xsl:attribute name="img_expand"><xsl:value-of select="@OpenIcon"/></xsl:attribute>
							</xsl:element>
		     			</xsl:when>
						<xsl:otherwise>
							<xsl:element name="img">
								<xsl:attribute name="name">Item_Img</xsl:attribute>
								<xsl:attribute name="id">__idItem_Img</xsl:attribute>
								<xsl:attribute name="align">absmiddle</xsl:attribute>
								<xsl:attribute name="src"><xsl:value-of select="@LeafIcon"/></xsl:attribute>
							</xsl:element>
						</xsl:otherwise>
					</xsl:choose>
					<xsl:element name="img">
						<xsl:attribute name="name">__idItemStatusImg</xsl:attribute>
						<xsl:attribute name="id">__idItemStatusImg</xsl:attribute>
						<xsl:attribute name="align">absmiddle</xsl:attribute>
						<xsl:choose>
							<xsl:when test="LessonStatus">
								<xsl:attribute name="src"><xsl:value-of select="LessonStatus"/>.gif</xsl:attribute>
							</xsl:when>
							<xsl:otherwise>
								<xsl:attribute name="src">1px.gif</xsl:attribute>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:element>
				
					<xsl:element name='a'>
						<xsl:attribute name="name">link</xsl:attribute>
						<xsl:attribute name="id">__idLinkCaption</xsl:attribute>
						<xsl:attribute name="href"></xsl:attribute>
						<xsl:value-of select="@Name" />
					</xsl:element>
				
			</xsl:element>	
			<xsl:element name="div">
				<xsl:attribute name="id">__idChildrenContainer</xsl:attribute>
				<xsl:attribute name="style">margin-top:5px;position:relative;margin-left:18px;display:none</xsl:attribute>		            		        
			</xsl:element>
		</xsl:element>		
		</xsl:for-each>
			
</xsl:template>
</xsl:stylesheet>