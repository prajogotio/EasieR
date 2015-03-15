

/* ========================================================================== */

var states = {
	FONT_SIZE : 15,
	FONT_FACE : "Arial",
	MARGIN : 26,
	WEAK_MARGIN : 6,
	getFontSetting : function() {
		return this.FONT_SIZE + "px " + this.FONT_FACE;
	},
	checkIsOnFocus : function(item) {
		if(states.elementOnFocus == item) return true;
		for (var i = 0; i < states.chosenStack.length; ++i) {
			if(states.chosenStack[i] == item) return true;
		}
		for (var i = 0; i < states.highlightedStack.length; ++i) {
			if(states.highlightedStack[i] == item) return true;
		}
		return false;
	},
	checkIsInHighlightedStack : function(item) {
		for (var i = 0; i < states.highlightedStack.length; ++i) {
			if(states.highlightedStack[i] == item) return true;
		}
		return false;
	},
};

/* ========================================================================== */


function Shapes(x, y, caption) {
	this.x = x;
	this.y = y;
	this.caption = caption;
}

Shapes.prototype.renderCaption = function(g) {
	g.save();
	g.fillStyle = "black";
	g.font = states.getFontSetting();
	var BBRect = g.measureText(this.caption);
	g.translate(this.x - BBRect.width/2, this.y);
	g.textBaseline = "middle";
	g.fillText(this.caption, 0, 0);
	g.restore();
}

Shapes.prototype.containsPoint = function(g, x, y) {
	g.font = states.getFontSetting();
	var BBRect = g.measureText(this.caption);
	var left = this.x - BBRect.width/2;
	var right = this.x + BBRect.width/2;
	var top = this.y - states.FONT_SIZE/2;
	var bottom = this.y + states.FONT_SIZE/2;
	return (left - 20 < x && x < right + 20 && top - 20 < y && y < bottom + 20);
}

Shapes.prototype.setCaption = function(caption) {
	this.caption = caption;
}

Shapes.prototype.setPosition = function(x, y) {
	this.x = x;
	this.y = y;
}

Shapes.prototype.renderLabel = function(g) {
	g.save();
	g.font = states.getFontSetting();
	var BBRect = g.measureText(this.caption);
	g.translate(this.x - BBRect.width/2, this.y);
	if(states.checkIsOnFocus(this)){
		g.fillStyle = "orange";
		g.fillRect(0, -states.FONT_SIZE/2, BBRect.width, states.FONT_SIZE);
	}
	g.fillStyle = "black";
	g.textBaseline = "middle";
	g.fillText(this.caption, 0, 0);
	g.restore();
}

Shapes.prototype.getX = function() { return this.x; }
Shapes.prototype.getY = function() { return this.y; }

/* ========================================================================== */

function Rectangle(x, y, caption) {
	Shapes.call(this, x, y, caption);
	this.isWeak = false;
	this.fillStyle = "white";
}

Rectangle.prototype = Object.create(Shapes.prototype);

Rectangle.prototype.render = function(g) {
	g.save();

	var x = this.x;
	var y = this.y;
	g.font = states.getFontSetting();
	var BBRect = g.measureText(this.caption);
	var width = BBRect.width + states.MARGIN;
	var height = states.FONT_SIZE + states.MARGIN;

	g.translate(x, y);
	g.fillRect(0, 0, 10, 10);
	g.fillStyle = this.fillStyle;
	g.strokeStyle = "black";
	g.lineWidth = 1;

	if(this.isWeak) {
		g.fillRect(-width/2 - states.WEAK_MARGIN, -height/2 - states.WEAK_MARGIN, width + states.WEAK_MARGIN * 2, height + states.WEAK_MARGIN * 2);
		g.strokeRect(-width/2 - states.WEAK_MARGIN, -height/2 - states.WEAK_MARGIN, width + states.WEAK_MARGIN * 2, height + states.WEAK_MARGIN * 2);
	}

	g.fillRect(-width/2, -height/2, width, height);
	g.strokeRect(-width/2, -height/2, width, height);

	g.restore();

	this.renderCaption(g);
}

Rectangle.prototype.setWeak = function() {
	this.isWeak = true;
}


/* ========================================================================== */


function Oval(x, y, caption) {
	Shapes.call(this, x, y, caption);
	this.isKey = false;
	this.fillStyle = "white";
}

Oval.prototype = Object.create(Shapes.prototype);

Oval.prototype.setKey = function() {
	this.isKey = true;
}

Oval.prototype.render = function(g) {
	g.save();

	var x = this.x;
	var y = this.y;
	g.font = states.getFontSetting();
	var BBRect = g.measureText(this.caption);
	var width = BBRect.width*0.7;
	var height = states.FONT_SIZE;

	g.translate(x, y);
	g.scale(width/height, 1);
	g.fillStyle = this.fillStyle;
	g.strokeStyle = "black";
	g.lineWidth = 1;

	g.beginPath();
	g.arc(0, 0, height, 0, 2*Math.PI, false);
	g.fill();
	g.stroke();
	g.restore();

	this.renderCaption(g);

	if(this.isKey) {
		g.save();
		g.translate(x, y);
		g.fillStyle = "black";
		g.fillRect(-BBRect.width/2, height/2 - 1, BBRect.width, 1);
		g.restore();
	}
}

/* ========================================================================== */


function Diamond(x, y, caption) {
	Shapes.call(this, x, y, caption);
	this.fillStyle = "white";
	this.isWeak = false;
}

Diamond.prototype = Object.create(Shapes.prototype);

Diamond.prototype.setWeak = function() {
	this.isWeak = true;
}

Diamond.prototype.render = function(g) {
	g.save();


	var x = this.x;
	var y = this.y;
	g.font = states.getFontSetting();
	var BBRect = g.measureText(this.caption);
	var width = BBRect.width;
	var height = states.FONT_SIZE;
	
	g.translate(x, y);
	g.fillStyle = this.fillStyle;
	g.strokeStyle = "black";
	g.lineWidth = 1;

	if (this.isWeak) {
		g.beginPath();
		g.moveTo(-0.7 * width - states.WEAK_MARGIN, 0);
		g.lineTo(0, 1 * height + states.WEAK_MARGIN);
		g.lineTo(0.7 * width + states.WEAK_MARGIN, 0);
		g.lineTo(0, -1 * height - states.WEAK_MARGIN);
		g.closePath();
		g.fill();
		g.stroke();
	}

	g.beginPath();
	g.moveTo(-0.7 * width, 0);
	g.lineTo(0, 1 * height);
	g.lineTo(0.7 * width, 0);
	g.lineTo(0, -1 * height);
	g.closePath();
	g.fill();
	g.stroke();

	g.restore();

	this.renderCaption(g);
}


/* ========================================================================== */


function IsaTriangle(x, y) {
	Shapes.call(this, x, y, "isa");
	this.fillStyle = "white";
}

IsaTriangle.prototype = Object.create(Shapes.prototype);

IsaTriangle.prototype.render = function(g) {
	g.save();

	var x = this.x;
	var y = this.y;
	g.font = states.getFontSetting();
	var BBRect = g.measureText(this.caption);
	var r = BBRect.width;
	
	g.translate(x, y);
	g.fillStyle = this.fillStyle;
	g.strokeStyle = "black";
	g.lineWidth = 1;

	g.beginPath();
	g.moveTo(0, -r);
	g.lineTo(r * Math.cos(30/180 * Math.PI), r * Math.sin(30/180 * Math.PI));
	g.lineTo(-r * Math.cos(30/180 * Math.PI), r * Math.sin(30/180 * Math.PI));
	g.closePath();
	g.fill();
	g.stroke();

	g.restore();
	this.renderCaption(g);
}

IsaTriangle.prototype.setWeak = function() {

}


/* ========================================================================== */


function Entity(x, y, caption) {
	this.attributes = [];
	this.isWeak = false;
	this.renderable = new Rectangle(x, y, caption);
}

Entity.prototype.addAttribute = function(attribute) {
	this.attributes.push(attribute);
	attribute.setParent(this);
	return this;
}

Entity.prototype.setWeak = function() {
	this.isWeak = true;
	this.renderable.setWeak();
}

Entity.prototype.unsetWeak = function() {
	this.isWeak = false;
	this.renderable.isWeak = false;
}

Entity.prototype.render = function(g) {
	if(states.checkIsOnFocus(this)) this.renderable.fillStyle = "orange";
	else this.renderable.fillStyle = "white";
	this.renderable.render(g);
	for (var i = 0; i < this.attributes.length; ++i) {
		this.attributes[i].render(g);
	}
}

Entity.prototype.renderLines = function(g) {
	for (var i = 0; i < this.attributes.length; ++i) {
		this.attributes[i].renderLines(g);
	}
}

Entity.prototype.isClicked = function(g, x, y) {
	return this.renderable.containsPoint(g, x, y);
}

Entity.prototype.setPosition = function(x, y) {
	var curX = this.renderable.x;
	var curY = this.renderable.y;
	var dX = x - curX;
	var dY = y - curY;
	this.renderable.setPosition(x,y);
	for (var i = 0; i < this.attributes.length; ++i) {
		var attrX = this.attributes[i].getX();
		var attrY = this.attributes[i].getY();
		this.attributes[i].setPosition(attrX + dX, attrY + dY);
	}
}

Entity.prototype.getY = function() {
	return this.renderable.y;
}

Entity.prototype.getX = function() {
	return this.renderable.x;
}


/* ========================================================================== */

function Attribute(x, y, caption) {
	this.parent = this;
	this.renderable = new Oval(x, y, caption);
	this.isKey = false;
}

Attribute.prototype.setKey = function() {
	this.isKey = true;
	this.renderable.setKey();
}

Attribute.prototype.unsetKey = function() {
	this.isKey = false;
	this.renderable.isKey = false;
}

Attribute.prototype.setParent = function(parent) {
	this.parent = parent;
}

Attribute.prototype.render = function(g) {
	if(states.checkIsOnFocus(this) || states.checkIsOnFocus(this.parent)) this.renderable.fillStyle = "orange";
	else this.renderable.fillStyle = "white";
	this.renderable.render(g);
}


Attribute.prototype.renderLines = function(g) {
	var parX = this.parent.getX();
	var parY = this.parent.getY();
	g.beginPath();
	g.moveTo(this.getX(), this.getY());
	g.lineTo(parX, parY);
	g.stroke();

}


Attribute.prototype.isClicked = function(g, x, y) {
	return this.renderable.containsPoint(g, x, y);
}

Attribute.prototype.getY = function() {
	return this.renderable.y;
}

Attribute.prototype.getX = function() {
	return this.renderable.x;
}

Attribute.prototype.setPosition = function(x, y) {
	this.renderable.setPosition(x, y);
}

/* ========================================================================== */


function Relation(x, y, caption) {
	this.entities = [];
	this.attributes = [];
	this.isWeak = false;
	this.isIsaRelationship = false;
	this.renderable = new Diamond(x, y, caption);
}

Relation.prototype.addEntity = function(entity, cardinality) {
	this.entities.push({"entity" : entity, "cardinality": cardinality});
	return this;
}


Relation.prototype.addAttribute = function(attribute) {
	this.attributes.push(attribute);
	attribute.setParent(this);
	return this;
}

Relation.prototype.setIsa = function() {
	this.isIsaRelationship = true;
	this.renderable = new IsaTriangle(this.getX(), this.getY());
}

Relation.prototype.render = function(g) {
	if(states.checkIsOnFocus(this)) this.renderable.fillStyle = "orange";
	else this.renderable.fillStyle = "white";
	this.isWeak = false;
	this.renderable.isWeak = false;
	for (var i = 0; i < this.entities.length; ++i) {
		if(this.isWeak) break;
		if (this.entities[i].entity.isWeak) {
			this.isWeak = true;
			this.renderable.setWeak();
			break;
		}
	}

	this.renderable.render(g);
	for (var i = 0; i < this.attributes.length; ++i) {
		this.attributes[i].render(g);
	}
}

Relation.prototype.renderLines = function(g) {
	var hashMap = {};
	for (var i = 0; i < this.entities.length; ++i) {
		if( hashMap[this.entities[i].entity.renderable.caption] == null ) {
			hashMap[this.entities[i].entity.renderable.caption] = 0;
		} else {
			hashMap[this.entities[i].entity.renderable.caption]++;
		}
		this.entities[i].parity = hashMap[this.entities[i].entity.renderable.caption];

	}
	for (var i = 0; i < this.entities.length; ++i) {
		var parity = this.entities[i].parity;
		if(parity % 2) {
			parity = - (parity+1) / 2;
		} else {
			parity = (parity) / 2 + 1;
		}
 		var eX = this.entities[i].entity.getX();
		var eY = this.entities[i].entity.getY();
		var dX = eX - this.getX();
		var dY = eY - this.getY();
		var t = -dY / dX;
		var uy = Math.sqrt(1 / (1 + t*t));
		var ux = t * uy;
		if(dX == 0) {
			uy = 0;
			ux = 1;
		}
		var mX = this.getX() + dX/2 + parity * ux * 200;
		var mY = this.getY() + dY/2 + parity * uy * 200;
		g.beginPath();
		if(hashMap[this.entities[i].entity.renderable.caption] == 0) {
			g.moveTo(this.getX(), this.getY());
			mX = this.getX();
			mY = this.getY();
			g.lineTo(eX, eY);
		} else {
			g.moveTo(this.getX(), this.getY());
			g.quadraticCurveTo(mX, mY, eX, eY);
		}
		g.stroke();

		this.renderArrow(g, this.entities[i], mX, mY);

	}

	for (var i = 0; i < this.attributes.length; ++i) {
		this.attributes[i].renderLines(g);
	}
}

Relation.prototype.renderArrow = function(g, entityInformation, X, Y) {
	g.save();
	var entity = entityInformation.entity;
	var cardinality = entityInformation.cardinality;
	var eX = entity.getX();
	var eY = entity.getY();
	g.font = states.getFontSetting();
	var width = g.measureText(entity.renderable.caption).width + states.MARGIN + (entity.isWeak ? states.WEAK_MARGIN * 2 : 0);
	
	var height = states.FONT_SIZE + states.MARGIN + (entity.isWeak ? states.WEAK_MARGIN * 2: 0);
	var dX = eX - X;
	var dY = eY - Y;



	var hRatio = Math.abs((Math.abs(dY) - height * 0.5)) / Math.abs(dY);
	var destX = X + dX  * hRatio;
	var destY = Y + dY  * hRatio;
	if(Math.abs(destY - eY) < height/2 || Math.abs(destX - eX) > width/2 ) {
		var vRatio = Math.abs((Math.abs(dX) - width * 0.5)) / Math.abs(dX);
		destX = X + dX * vRatio;
		destY = Y + dY * vRatio;
	}

	g.translate(destX, destY);
	g.rotate(Math.atan2(dY, dX));
	g.strokeStyle = "black";
	g.lineWidth = 1;
	if (cardinality == "1") {
		g.beginPath();
		g.moveTo(-16 * Math.cos(20/180 * Math.PI), 16 * Math.sin(20/180 * Math.PI));
		g.lineTo(0, 0);
		g.lineTo(-16 * Math.cos(20/180 * Math.PI), -16 * Math.sin(20/180 * Math.PI));
		g.stroke();
	} else if (cardinality == "R") {
		g.beginPath();
		g.moveTo(-18, 7);
		g.bezierCurveTo(4, 7, 4, -7, -18, -7);
		g.stroke();
	}
	g.restore();
}

Relation.prototype.isClicked = function(g, x, y) {
	return this.renderable.containsPoint(g, x, y);
}

Relation.prototype.getY = function() {
	return this.renderable.y;
}

Relation.prototype.getX = function() {
	return this.renderable.x;
}

Relation.prototype.setPosition = function(x, y) {
	var curX = this.renderable.x;
	var curY = this.renderable.y;
	var dX = x - curX;
	var dY = y - curY;
	this.renderable.setPosition(x,y);
	for (var i = 0; i < this.attributes.length; ++i) {
		var attrX = this.attributes[i].getX();
		var attrY = this.attributes[i].getY();
		this.attributes[i].setPosition(attrX + dX, attrY + dY);
	}
}

Relation.prototype.containsEntity = function(entity) {
	for (var i = 0; i < this.entities.length; ++i) {
		if (this.entities[i].entity == entity) return true;
	}
	return false;
}

Relation.prototype.removeEntity = function(entity) {
	for (var i = 0; i < this.entities.length; ++i) {
		if (this.entities[i].entity == entity) {
			if(this.isIsaRelationship) {
				var index = states.relations.indexOf(this);
				states.relations.splice(index, 1);
			} else {
				this.entities.splice(i, 1);
			}
			return;
		}
	}
}

/* ========================================================================== */


addEventListener("DOMContentLoaded", function(e) {
	states.screen = document.getElementById('screen');
	states.g = states.screen.getContext('2d');
	states.addEntityButton = document.getElementById("add-entity");
	states.addAttributeButton = document.getElementById("add-attribute");
	states.addRelationButton = document.getElementById("add-relation");
	states.addIsaButton = document.getElementById("add-isa");
	states.shadower = document.getElementById("shadower");
	states.entities = [];
	states.relations = [];
	states.labels = [];
	states.chosenStack = [];
	states.highlightedStack = [];
	states.commands = { "LEFT_CLICK" : false, "CAN_RESIZE" : false};
	states.elementOnFocus = false;
	states.isBoundingClientRectAvailable = false;
	states.onItemPlacedHandler = function() {};
	//testerCode();

	states.commands["SYSTEM_KEY_ACTIVE"] = true;
	
	document.addEventListener("keydown", function(e) {
		if(states.commands["SYSTEM_KEY_ACTIVE"]) {
			if(e.which == 69) {
				addEntityEvent();
				e.preventDefault();
			} else if (e.which == 65) {
				addAttributeEvent();
				e.preventDefault();
			} else if (e.which == 82) {
				addRelationEvent();
				e.preventDefault();
			} else if (e.which == 73) {
				addIsaEvent();
				e.preventDefault();
			} else if (e.which == 68) {
				deleteItemEvent();
				e.preventDefault();
			} else if (e.which == 75) {
				setAsKeyEvent();
				e.preventDefault();
			} else if (e.which == 87) {
				setAsWeakEvent();
				e.preventDefault();
			} else if (e.which == 189) {
				addAssociationEvent();
				e.preventDefault();
			} else if (e.which == 88) {
				removeAssociationEvent();
				e.preventDefault();
			} else if (e.which == 76) {
				addLabelEvent();
				e.preventDefault();
			} else if (e.which == 78) {
				changeCaptionEvent();
				e.preventDefault();
			} else if (e.which == 71) {
				getDiagramEvent();
				e.preventDefault();
			}
		}
	});

	states.screen.addEventListener("mousedown", function(e) {
		if(e.which == 1) {
			if(states.commands["CHOOSING_ENTITY"]) {
				getElementOnFocus(e.pageX - states.screenOffset.x, e.pageY - states.screenOffset.y);
				if(states.chooserChecker()) {
					states.commands["CHOOSING_ENTITY"] = false;
					e.preventDefault();
					states.chosenHandler();
				}
				return;
			}
			if(states.commands["PLACING_ITEM"]) {
				states.commands["SYSTEM_KEY_ACTIVE"] = true;
				states.commands["PLACING_ITEM"] = false;
				states.onItemPlacedHandler();
				return;
			}
			states.lastClickPosition = {x : e.pageX - states.screenOffset.x, y : e.pageY - states.screenOffset.y};
			states.commands["LEFT_CLICK"] = true;
			getElementOnFocus(e.pageX - states.screenOffset.x, e.pageY - states.screenOffset.y);
			if(states.elementOnFocus == false || !states.checkIsInHighlightedStack(states.elementOnFocus)) states.highlightedStack = [];
		}
	});

	document.addEventListener("mouseup", function(e) {
		states.commands["LEFT_CLICK"] = false;
		states.highlightedEndpoint = null;
		for (var i = 0; i < states.highlightedStack.length; ++i) {
			states.highlightedPositionVector[i].x = states.highlightedStack[i].getX();
			states.highlightedPositionVector[i].y = states.highlightedStack[i].getY();
		}
		
	});

	document.addEventListener("mousemove", function(e) {
		var curX = e.pageX - states.screenOffset.x;
		var curY = e.pageY - states.screenOffset.y;

		states.screen.style.cursor = "default";
		document.body.style.cursor = "default";

		if(states.screen.width - 30 < curX && curX <= states.screen.width + 30 && states.screen.height - 30 <= curY && curY <= states.screen.height + 30) {
			states.screen.style.cursor = "nwse-resize";
			document.body.style.cursor = "nwse-resize";
			states.commands["CAN_RESIZE"] = true;
		} else {
			states.commands["CAN_RESIZE"] = false;
		}

		if(states.commands["LEFT_CLICK"] && states.commands["CAN_RESIZE"]) {
			states.screen.width = curX;
			states.screen.height = curY;
			return;
		}

		if(states.commands["LEFT_CLICK"] && states.elementOnFocus === false) {
			states.highlightedEndpoint = {};
			states.highlightedEndpoint.x = curX;
			states.highlightedEndpoint.y = curY;
			getHighlightedElements();
		}
		if(states.commands["LEFT_CLICK"] || states.commands["PLACING_ITEM"]) {
			if(states.elementOnFocus !== false) {
				if(states.highlightedStack.length == 0 || states.commands["PLACING_ITEM"]) {
					states.elementOnFocus.setPosition(curX, curY);
					states.highlightedStack = [];
				} else {
					var dX = curX - states.lastClickPosition.x;
					var dY = curY - states.lastClickPosition.y;
					for (var i = 0; i < states.highlightedStack.length; ++i) {
						states.highlightedStack[i].setPosition(states.highlightedPositionVector[i].x + dX, states.highlightedPositionVector[i].y + dY);
					}
				}
			}
		}

	});

	states.addEntityButton.addEventListener("click", function(e) {
		addEntityEvent();
	});

	document.getElementById("add-entity-name").addEventListener("keydown", function(e) {
		if(e.which == 13) {
			document.getElementById("add-entity-form").style.setProperty("display", "none");
			states.shadower.style.setProperty("display", "none");
			addEntityHandler(this.value, document.getElementById("entity-is-weak-checkbox").checked);
		}
	})
	document.getElementById("add-entity-cancel-button").addEventListener("click", function(e){
		document.getElementById("add-entity-form").style.setProperty("display", "none");
		states.shadower.style.setProperty("display", "none");
		states.commands["SYSTEM_KEY_ACTIVE"] = true;
	});
	states.shadower.addEventListener("click", function(e) {
		document.getElementById("add-entity-form").style.setProperty("display", "none");
		document.getElementById("add-attribute-form").style.setProperty("display", "none");
		document.getElementById("add-relation-form").style.setProperty("display", "none");
		document.getElementById("confirmation").style.setProperty("display", "none");
		document.getElementById("select-association-type").style.setProperty("display", "none");
		document.getElementById("remove-association-type").style.setProperty("display", "none");
		document.getElementById("add-label-form").style.setProperty("display", "none");
		document.getElementById("change-caption-form").style.setProperty("display", "none");
		document.getElementById("get-image-form").style.display = "none";
		document.getElementById("download-image").style.display = "none";

		states.shadower.style.setProperty("display", "none");
		states.chosenStack = [];
		states.commands["SYSTEM_KEY_ACTIVE"] = true;
	});

	document.getElementById("add-entity-ok-button").addEventListener("click", function(e){
		document.getElementById("add-entity-form").style.setProperty("display", "none");
		states.shadower.style.setProperty("display", "none");
		addEntityHandler(document.getElementById("add-entity-name").value, document.getElementById("entity-is-weak-checkbox").checked);
	});

	states.addAttributeButton.addEventListener("click", function(e){
		addAttributeEvent();
	})

	document.getElementById("chooser-cancel-button").addEventListener("click", function(e) {
		document.getElementById("entity-chooser").style.setProperty("display", "none");
		states.commands["CHOOSING_ENTITY"] = false;
		states.commands["SYSTEM_KEY_ACTIVE"] = true;
		document.getElementById("shadow-menu").style.setProperty("display", "none");
		states.chosenStack = [];
	});
	document.getElementById("shadow-menu").addEventListener("click", function(e) {
		document.getElementById("entity-chooser").style.setProperty("display", "none");
		states.commands["CHOOSING_ENTITY"] = false;
		states.commands["SYSTEM_KEY_ACTIVE"] = true;
		document.getElementById("shadow-menu").style.setProperty("display", "none");
		states.chosenStack = [];

	});

	document.getElementById("add-attribute-ok-button").addEventListener("click", function(e) {
		document.getElementById("add-attribute-form").style.setProperty("display", "none");
		states.shadower.style.setProperty("display", "none");
		addAttributeHandler(document.getElementById("add-attribute-name").value, document.getElementById("attribute-is-key-checkbox").checked);
	});

	document.getElementById("add-attribute-name").addEventListener("keydown", function(e) {
		if(e.which == 13) {
			document.getElementById("add-attribute-form").style.setProperty("display", "none");
			states.shadower.style.setProperty("display", "none");
			addAttributeHandler(this.value, document.getElementById("attribute-is-key-checkbox").checked);
		}
	})

	document.getElementById("add-attribute-cancel-button").addEventListener("click", function(e) {
		states.commands["SYSTEM_KEY_ACTIVE"] = true;
		document.getElementById("add-attribute-form").style.setProperty("display", "none");
		states.shadower.style.setProperty("display", "none");
	});

	document.getElementById("add-relation-ok-button").addEventListener('click', function(e) {
		addRelationHandler();
	});

	document.getElementById("add-relation-name").addEventListener("keydown", function(e) {
		if(e.which == 13) {
			addRelationHandler();
			return false;
		}
	})

	document.getElementById("add-relation-cancel-button").addEventListener("click", function(e) {
		states.commands["SYSTEM_KEY_ACTIVE"] = true;
		document.getElementById("add-relation-form").style.setProperty("display", "none");
		states.shadower.style.setProperty("display", "none");
	});

	states.addRelationButton.addEventListener("click", function(e) {
		addRelationEvent();
	});


	document.getElementById("confirmation-ok-button").addEventListener("click", function() {
		states.onConfirmationResponse(true);
	});

	document.getElementById("confirmation-cancel-button").addEventListener("click", function() {
		states.onConfirmationResponse(false);
	});

	document.getElementById("delete").addEventListener("click", function() {
		deleteItemEvent();
	});

	document.getElementById("set-key").addEventListener("click", function() {
		setAsKeyEvent();
	});

	document.getElementById("set-weak").addEventListener("click", function() {
		setAsWeakEvent();
	});

	document.getElementById("add-isa").addEventListener("click", function() {
		addIsaEvent();
	});

	document.getElementById("select-association-type-cancel-button").addEventListener("click", function() {
		document.getElementById("select-association-type").style.setProperty("display", "none");
		states.shadower.style.setProperty("display", "none");
		states.chosenStack = [];
	});

	document.getElementById("N-association").addEventListener("click", function() {
		addAssociationHandler("N");
	});

	document.getElementById("1-association").addEventListener("click", function() {
		addAssociationHandler("1");
	});

	document.getElementById("referential-integrity").addEventListener("click", function() {
		addAssociationHandler("R");
	});

	document.getElementById("add-association").addEventListener("click", function() {
		addAssociationEvent();
	});

	document.getElementById("remove-association-type-cancel-button").addEventListener("click",function() {
		states.shadower.style.setProperty("display", "none");
		document.getElementById("remove-association-type").style.setProperty("display", "none");
		states.commands["SYSTEM_KEY_ACTIVE"] = true;
	});

	document.getElementById("remove-association").addEventListener("click", function() {
		removeAssociationEvent();
	});

	document.getElementById("add-label-ok-button").addEventListener("click", function() {
		addLabelHandler();
	});

	document.getElementById("add-label-cancel-button").addEventListener("click", function() {
		states.commands["SYSTEM_KEY_ACTIVE"] = true;
		states.shadower.style.setProperty("display", "none");
		document.getElementById("add-label-form").style.setProperty("display", "none");
	});

	document.getElementById("add-label-caption").addEventListener("keydown", function(e) {
		if(e.which == 13) {
			addLabelHandler();
			return false;
		}
	});

	document.getElementById("add-label").addEventListener("click", function() {
		addLabelEvent();
	});

	document.getElementById("change-caption-ok-button").addEventListener("click", function() {
		changeCaptionHandler();
	});

	document.getElementById("change-caption-cancel-button").addEventListener("click", function() {
		document.getElementById("change-caption-form").style.setProperty("display", "none");
		states.shadower.style.setProperty('display', 'none');
		states.commands["SYSTEM_KEY_ACTIVE"] = true;
	});

	document.getElementById("change-caption").addEventListener("keydown", function(e) {
		if(e.which == 13) {
			changeCaptionHandler();
			return false;
		}
	})

	document.getElementById("change-caption-opt").addEventListener("click", function() {
		changeCaptionEvent();
	});

	document.getElementById("get-diagram").addEventListener("click", function() {
		getDiagramEvent();
	});

	document.getElementById("get-image-ok-button").addEventListener("click", function() {
		getDiagram();
	});

	document.getElementById("get-image-cancel-button").addEventListener("click", function() {
		document.getElementById("get-image-form").style.display = "none";
		states.shadower.style.display = "none";
		states.commands["SYSTEM_KEY_ACTIVE"] = true;
	});

	document.getElementById("download-image-link").addEventListener("click", function() {
		document.getElementById("download-image").style.display = "none";
		states.shadower.style.display = "none";
		states.commands["SYSTEM_KEY_ACTIVE"] = true;
	});

	document.getElementById("get-image-name").addEventListener("keydown", function(e) {
		if(e.which == 13) {
			getDiagram();
			return false;
		}
	});

	states.appLoop = setInterval(function() {
		if(!states.isBoundingClientRectAvailable) getBoundingClientRect();
		updateStates();
		renderScreen();
	}, 1000/60);
});

function addEntityEvent() {
	states.highlightedStack = [];
	states.highlightedPositionVector = [];
	states.elementOnFocus = false;
	states.commands["SYSTEM_KEY_ACTIVE"] = false;
	var form = document.getElementById("add-entity-form");
	form.style.setProperty("display", "block");
	var textbox = document.getElementById("add-entity-name");
	textbox.value = "entity name";
	states.shadower.style.setProperty("display", "block");
	document.getElementById("entity-is-weak-checkbox").checked = false;
	textbox.select();
	textbox.focus();
}

function addEntityHandler(caption, isWeak) {
	setNotification("Left-click to place the Entity");
	states.commands["PLACING_ITEM"] = true;
	var entity = new Entity(100, 100, caption);
	if(isWeak) entity.setWeak();
	states.entities.push(entity);
	states.elementOnFocus = entity;
}

function getBoundingClientRect() {
	states.screenBB = states.screen.getBoundingClientRect();
	states.bodyBB = document.body.getBoundingClientRect();
	states.screenOffset = {x : states.screenBB.left - states.bodyBB.left,
						   y : states.screenBB.top - states.bodyBB.top };
	states.isBoundingClientRectAvailable = true;
}

function getElementOnFocus(x, y) {
	for (var i = 0; i < states.relations.length; ++i) {
		for (var j = 0; j < states.relations[i].attributes.length; ++j) {
			if(states.relations[i].attributes[j].isClicked(states.g, x, y)) {
				states.elementOnFocus = states.relations[i].attributes[j];
				return;
			}
		}
		if(states.relations[i].isClicked(states.g, x, y)) {
			states.elementOnFocus = states.relations[i];
			return;
		}
	}
	for (var i = 0; i < states.entities.length; ++i) {
		for (var j = 0; j < states.entities[i].attributes.length; ++j) {
			if(states.entities[i].attributes[j].isClicked(states.g, x, y)) {
				states.elementOnFocus = states.entities[i].attributes[j];
				return;
			}
		}
		if(states.entities[i].isClicked(states.g, x, y)) {
			states.elementOnFocus = states.entities[i];
			return;
		}
	}
	
	for (var i = 0; i < states.labels.length; ++i) {
		if(states.labels[i].containsPoint(states.g, x, y)) {
			states.elementOnFocus = states.labels[i];
			return;
		}
	}

	states.elementOnFocus = false;
}

function getHighlightedElements() {
	states.highlightedStack = [];
	states.highlightedPositionVector = [];
	for (var i = 0; i < states.relations.length; ++i) {
		var isInside = false;
		if(highlightedAreaContainsPoint(states.relations[i].renderable.x, states.relations[i].renderable.y)) {
			states.highlightedStack.push(states.relations[i]);
			states.highlightedPositionVector.push({x:states.relations[i].getX(), y:states.relations[i].getY()})
			isInside = true;
		}
		if(isInside) continue;
		for (var j = 0; j < states.relations[i].attributes.length; ++j) {
			if(highlightedAreaContainsPoint(states.relations[i].attributes[j].renderable.x,  states.relations[i].attributes[j].renderable.y)) {
				states.highlightedStack.push(states.relations[i].attributes[j]);
				states.highlightedPositionVector.push({x:states.relations[i].attributes[j].getX(), y:states.relations[i].attributes[j].getY()});
			}
		}
	}
	for (var i = 0; i < states.entities.length; ++i) {
		var isInside = false;
		if(highlightedAreaContainsPoint(states.entities[i].renderable.x, states.entities[i].renderable.y)) {
			states.highlightedStack.push(states.entities[i]);
			states.highlightedPositionVector.push({x:states.entities[i].getX(), y:states.entities[i].getY()});
			isInside = true;
		}
		if(isInside) continue;
		for (var j = 0; j < states.entities[i].attributes.length; ++j) {
			if(highlightedAreaContainsPoint(states.entities[i].attributes[j].renderable.x, states.entities[i].attributes[j].renderable.y)) {
				states.highlightedStack.push(states.entities[i].attributes[j]);
				states.highlightedPositionVector.push({x:states.entities[i].attributes[j].getX(), y:states.entities[i].attributes[j].getY()});
			}
		}
	}
	
	for (var i = 0; i < states.labels.length; ++i) {
		if(highlightedAreaContainsPoint(states.labels[i].x, states.labels[i].y)) {
			states.highlightedStack.push(states.labels[i]);
			states.highlightedPositionVector.push({x:states.labels[i].getX(), y:states.labels[i].getY()});
		}
	}
}

function highlightedAreaContainsPoint(x, y) {
	var leftX = Math.min(states.lastClickPosition.x, states.highlightedEndpoint.x);
	var rightX = Math.max(states.lastClickPosition.x, states.highlightedEndpoint.x);
	var upperY = Math.min(states.lastClickPosition.y, states.highlightedEndpoint.y);
	var lowerY = Math.max(states.lastClickPosition.y, states.highlightedEndpoint.y);
	return leftX < x && x < rightX && upperY < y && y < lowerY;
}

function setNotification(message) {
	var notifier = document.getElementById("notifier");
	notifier.innerHTML = message;
	notifier.style.setProperty("opacity", "1");
	setTimeout(function() {
		notifier.style.setProperty("opacity", "0");
	}, 1200);
}



function updateStates() {

}

function addAttributeEvent() {
	states.highlightedStack = [];
	states.highlightedPositionVector = [];
	states.commands["SYSTEM_KEY_ACTIVE"] = false;
	states.chooserChecker = function() {
		return states.elementOnFocus.constructor == Entity || states.elementOnFocus.constructor == Relation;
	}
	states.chosenHandler = function() {
		document.getElementById("shadow-menu").style.setProperty("display", "none");
		document.getElementById("shadower").style.setProperty("display", "block");
		document.getElementById("entity-chooser").style.setProperty("display", "none");
		document.getElementById("add-attribute-form").style.setProperty("display", "block");
		document.getElementById("attribute-is-key-checkbox").checked = false;
		document.getElementById("add-attribute-entity-name").innerHTML = states.elementOnFocus.renderable.caption;
		document.getElementById("add-attribute-name").value = "attribute name";
		document.getElementById("add-attribute-name").select();
		document.getElementById("add-attribute-name").focus();
	}
	if(!states.chooserChecker()) {
		states.elementOnFocus = false;
		document.getElementById("shadow-menu").style.setProperty("display", "block");
		document.getElementById("chooser-label").innerHTML = "Select an <span style='color:orange;'>entity</span> for which the attribute belongs";
		document.getElementById("entity-chooser").style.setProperty("display", "block");
		states.commands["CHOOSING_ENTITY"] = true;
	} else {
		states.chosenHandler();
	}

}

function addAttributeHandler(caption, isKey) {
	document.getElementById("add-attribute-form").style.setProperty("display", "none");
	states.shadower.style.setProperty("display", "none");
	var attribute = new Attribute(100, 100, caption);
	attribute.setParent(states.elementOnFocus);
	if(isKey) attribute.setKey();
	states.elementOnFocus.addAttribute(attribute);
	states.elementOnFocus = attribute;
	states.commands["PLACING_ITEM"] = true;
	states.onItemPlacedHandler = function(e) {
		states.elementOnFocus = states.elementOnFocus.parent;
		states.onItemPlacedHandler = function() {};
	}
}


function renderScreen() {
	states.g.fillStyle = "white";
	states.g.fillRect(0, 0, states.screen.width, states.screen.height);
	for(var i = 0; i < states.entities.length; ++i) {
		states.entities[i].renderLines(states.g);
	}

	for(var i = 0; i < states.relations.length; ++i) {
		states.relations[i].renderLines(states.g);
	}

	for(var i = 0; i < states.entities.length; ++i) {
		states.entities[i].render(states.g);
	}

	for(var i = 0; i < states.relations.length; ++i) {
		states.relations[i].render(states.g);
	}

	for(var i = 0; i < states.labels.length; ++i) {
		states.labels[i].renderLabel(states.g);
	}

	if(states.highlightedEndpoint != null) {
		states.g.fillStyle = "rgba(208,203,173,0.4)";
		var X = Math.min(states.lastClickPosition.x, states.highlightedEndpoint.x);
		var Y = Math.min(states.lastClickPosition.y, states.highlightedEndpoint.y);
		var width = Math.abs(states.lastClickPosition.x - states.highlightedEndpoint.x);
		var height = Math.abs(states.lastClickPosition.y - states.highlightedEndpoint.y);
		states.g.fillRect(X, Y, width, height);
	}

}


function addRelationEvent() {
	states.highlightedStack = [];
	states.highlightedPositionVector = [];
	states.elementOnFocus = false;
	states.commands["SYSTEM_KEY_ACTIVE"] = false;
	document.getElementById("add-relation-form").style.setProperty("display", "block");
	document.getElementById("shadower").style.setProperty("display", "block");
	document.getElementById("add-relation-name").value = "relation name";
	document.getElementById("add-relation-name").select();
	document.getElementById("add-relation-name").focus();
}

function addRelationHandler() {
	setNotification("Left-click to place the relation");
	caption = document.getElementById("add-relation-name").value;
	states.commands["PLACING_ITEM"] = true;
	var relation = new Relation(100, 100, caption);
	states.relations.push(relation);
	states.elementOnFocus = relation;
	document.getElementById("add-relation-form").style.setProperty("display", "none");
	document.getElementById("shadower").style.setProperty("display", "none");
}

function addIsaEvent() {
	states.highlightedStack = [];
	states.highlightedPositionVector = [];
	states.elementOnFocus = false;
	states.chooserChecker = function() {
		return states.elementOnFocus.constructor == Entity;
	}
	document.getElementById("shadow-menu").style.setProperty("display", "block");
	document.getElementById("chooser-label").innerHTML = "Select the <span style='color:orange;'>PARENT entity</span> of the isa relationship";
	document.getElementById("entity-chooser").style.setProperty("display", "block");
	states.commands["SYSTEM_KEY_ACTIVE"] = false;
	states.commands["CHOOSING_ENTITY"] = true;
	states.chosenHandler = function() {
		states.commands["CHOOSING_ENTITY"] = true;
		states.chosenStack = [];
		states.chosenStack.push(states.elementOnFocus);
		document.getElementById("chooser-label").innerHTML = "Select the <span style='color:orange;'>CHILD entity</span> of the isa relationship";
		states.chooserChecker = function() {
			return states.elementOnFocus.constructor == Entity && states.elementOnFocus != states.chosenStack[0];
		}
		states.chosenHandler = function() {
			states.chosenStack.push(states.elementOnFocus);
			addIsaRelation();
			states.commands["SYSTEM_KEY_ACTIVE"] = true;
			states.chosenStack = [];
			document.getElementById("entity-chooser").style.setProperty("display", "none");
			document.getElementById("shadow-menu").style.setProperty("display", "none");

		}
	}
}

function addIsaRelation() {
	var parent = states.chosenStack[0];
	var child = states.chosenStack[1];
	var isa = new Relation(0.5 * (parent.getX() + child.getX()), 0.5 * (parent.getY() + child.getY()), "");
	isa.setIsa();
	isa.addEntity(parent, "N");
	isa.addEntity(child, "N");
	states.relations.push(isa);
	states.elementOnFocus = isa;
}

function deleteItemEvent() {
	states.commands["SYSTEM_KEY_ACTIVE"] = false;
	if(states.elementOnFocus == false && states.highlightedStack.length == 0) {

		states.chooserChecker = function() {
			return states.elementOnFocus.constructor != false;
		}
		document.getElementById("shadow-menu").style.setProperty("display", "block");
		document.getElementById("chooser-label").innerHTML = "Select the element to be <span style='color:orange;'>deleted</span>";
		document.getElementById("entity-chooser").style.setProperty("display", "block");
		states.commands["SYSTEM_KEY_ACTIVE"] = false;
		states.commands["CHOOSING_ENTITY"] = true;
		states.chosenHandler = function() {
			document.getElementById("shadow-menu").style.setProperty("display", "none");
			document.getElementById("entity-chooser").style.setProperty("display", "none");
			deleteItemHandler(states.elementOnFocus);
		}
	} else {
		deleteItemHandler(states.elementOnFocus);
	}
}

function deleteItemHandler(item) {
	if(states.highlightedStack.length != 0) {
		displayConfirmation("Are you sure you want to delete all the highlighted elements?");
	} else {
		displayConfirmation("Confirm deletion of " + (item.constructor == Shapes ? item.caption : item.renderable.caption) + "?");
	}
	states.onConfirmationResponse = function(response) {
		states.shadower.style.setProperty("display", "none");
		document.getElementById("confirmation").style.setProperty("display", "none");
		states.commands["SYSTEM_KEY_ACTIVE"] = true;
		if(response) {
			states.elementOnFocus = false;
			if(states.highlightedStack.length == 0) {
				deleteItem(item);
			} else {
				for (var i = 0; i < states.highlightedStack.length; ++i) {
					deleteItem(states.highlightedStack[i]);
				}
				states.highlightedStack = [];
				states.highlightedPositionVector = [];
			}
		}
	}
}

function deleteItem(item) {
	if(item.constructor == Entity) {
		var index = states.entities.indexOf(item);
		states.entities.splice(index, 1);
		for (var i = 0; i < states.relations.length; ++i) {
			states.relations[i].removeEntity(item);
		}
	}
	else if (item.constructor == Relation) {
		var index = states.relations.indexOf(item);
		states.relations.splice(index, 1);
	}
	else if (item.constructor == Attribute) {
		var parent = item.parent;
		var index = parent.attributes.indexOf(item);
		parent.attributes.splice(index, 1);
	}
	else if (item.constructor == Shapes) {
		var index = states.labels.indexOf(item);
		states.labels.splice(index, 1);
	}
}

function displayConfirmation(message) {
	document.getElementById("confirmation").style.setProperty("display", "block");
	document.getElementById("confirmation-message").innerHTML = message;
	states.shadower.style.setProperty("display", "block");
	document.getElementById("confirmation-ok-button").focus();
}

function setAsKeyEvent() {
	states.highlightedStack = [];
	states.highlightedPositionVector = [];
	states.commands["SYSTEM_KEY_ACTIVE"] = false;
	states.chooserChecker = function() {
		return states.elementOnFocus.constructor == Attribute;
	}

	states.chosenHandler = function() {
		states.commands["SYSTEM_KEY_ACTIVE"] = true;
		document.getElementById("entity-chooser").style.setProperty("display", "none");
		document.getElementById("shadow-menu").style.setProperty("display", "none");
		if(states.elementOnFocus.isKey) states.elementOnFocus.unsetKey();
		else states.elementOnFocus.setKey();
	}

	if(states.chooserChecker()) {
		states.chosenHandler();
	} else {
		states.elementOnFocus = false;
		states.commands["CHOOSING_ENTITY"] = true;
		document.getElementById("chooser-label").innerHTML = "Choose an <span style='color:orange;'>attribute</span> for which the key property is to be switched";
		document.getElementById("entity-chooser").style.setProperty("display", "block");
		document.getElementById("shadow-menu").style.setProperty("display", "block");
	}
}

function setAsWeakEvent() {
	states.highlightedStack = [];
	states.highlightedPositionVector = [];
	states.commands["SYSTEM_KEY_ACTIVE"] = false;
	states.chooserChecker = function() {
		return states.elementOnFocus.constructor == Entity;
	}

	states.chosenHandler = function() {
		states.commands["SYSTEM_KEY_ACTIVE"] = true;
		document.getElementById("entity-chooser").style.setProperty("display", "none");
		document.getElementById("shadow-menu").style.setProperty("display", "none");
		if(states.elementOnFocus.isWeak) states.elementOnFocus.unsetWeak();
		else states.elementOnFocus.setWeak();
	}

	if(states.chooserChecker()) {
		states.chosenHandler();
	} else {
		states.elementOnFocus = false;
		states.commands["CHOOSING_ENTITY"] = true;
		document.getElementById("chooser-label").innerHTML = "Choose an <span style='color:orange;'>entity</span> for which the weak property is to be switched";
		document.getElementById("entity-chooser").style.setProperty("display", "block");
		document.getElementById("shadow-menu").style.setProperty("display", "block");
	}
}

function addAssociationEvent() {
	states.highlightedStack = [];
	states.highlightedPositionVector = [];
	states.commands["SYSTEM_KEY_ACTIVE"] = false;
	states.chooserChecker = function() {
		return states.elementOnFocus.constructor == Relation && !states.elementOnFocus.isIsaRelationship;
	}

	states.chosenHandler = function() {
		states.commands["SYSTEM_KEY_ACTIVE"] = false;
		states.commands["CHOOSING_ENTITY"] = true;
		states.chosenStack = [];
		states.chosenStack.push(states.elementOnFocus);
		states.elementOnFocus = false;
		document.getElementById("entity-chooser").style.setProperty("display", "block");
		document.getElementById("shadow-menu").style.setProperty("display", "block");
		document.getElementById("chooser-label").innerHTML = "Choose the <span style='color:orange;'>entity</span> to be associated with";
		states.chooserChecker = function() {
			return states.elementOnFocus.constructor == Entity;
		}
		states.chosenHandler = function() {
			states.commands["SYSTEM_KEY_ACTIVE"] = false;
			states.chosenStack.push(states.elementOnFocus);
			document.getElementById("entity-chooser").style.setProperty("display", "none");
			document.getElementById("shadow-menu").style.setProperty("display", "none");
			selectTypeOfAssociationEvent();
		}

	}

	if(states.chooserChecker()) {
		states.chosenHandler();
	} else {
		states.elementOnFocus = false;
		states.commands["CHOOSING_ENTITY"] = true;
		document.getElementById("chooser-label").innerHTML = "Choose a <span style='color:orange;'>relation</span> for which the association will be added";
		document.getElementById("entity-chooser").style.setProperty("display", "block");
		document.getElementById("shadow-menu").style.setProperty("display", "block");
	}
}

function selectTypeOfAssociationEvent() {
	document.getElementById("select-association-type").style.setProperty("display", "block");
	states.shadower.style.setProperty("display", "block");
}

function addAssociationHandler(cardinality) {
	var relation = states.chosenStack[0];
	var entity = states.chosenStack[1];
	relation.addEntity(entity, cardinality);
	states.shadower.style.setProperty("display", "none");
	document.getElementById("select-association-type").style.setProperty("display", "none");
	states.commands["SYSTEM_KEY_ACTIVE"] = true;
	states.chosenStack = [];
	states.elementOnFocus = relation;
}

function removeAssociationEvent() {
	states.highlightedStack = [];
	states.highlightedPositionVector = [];
	states.commands["SYSTEM_KEY_ACTIVE"] = false;
	states.chooserChecker = function() {
		return states.elementOnFocus.constructor == Relation && !states.elementOnFocus.isIsaRelationship;
	}

	states.chosenHandler = function() {
		states.commands["SYSTEM_KEY_ACTIVE"] = false;
		document.getElementById("entity-chooser").style.setProperty("display", "none");
		document.getElementById("shadow-menu").style.setProperty("display", "none");
		displayListOfAssociation();

	}

	if(states.chooserChecker()) {
		states.chosenHandler();
	} else {
		states.elementOnFocus = false;
		states.commands["CHOOSING_ENTITY"] = true;
		document.getElementById("chooser-label").innerHTML = "Choose a <span style='color:orange;'>relation</span> for which the association will be removed";
		document.getElementById("entity-chooser").style.setProperty("display", "block");
		document.getElementById("shadow-menu").style.setProperty("display", "block");
	}
}

function displayListOfAssociation() {
	var relation = states.elementOnFocus;
	document.getElementById("remove-association-type").style.setProperty("display", "block");
	document.getElementById("remove-assoc-rel-name").innerHTML = states.elementOnFocus.renderable.caption;
	states.shadower.style.setProperty("display", "block");
	var list = document.getElementById("assoc-list");
	list.innerHTML = "";
	for (var i = 0; i < states.elementOnFocus.entities.length; ++i ) {
		var cur = states.elementOnFocus.entities[i];
		var cardinality = (cur.cardinality == "N" ? "to Many" : (cur.cardinality == "1" ? "to One" : "Referential Integrity") );
		var div = document.createElement("div");
		div.innerHTML = cur.entity.renderable.caption + ", " + cardinality;
		div.onclick = (function(current){
			return function() {
				removeAssociationHandler(relation, cur);
				document.getElementById("remove-association-type").style.setProperty("display", "none");
				states.shadower.style.setProperty("display", "none");
			}
		})(cur);
		var a = document.createElement("a");
		a.appendChild(div);
		list.appendChild(a);
	}
}

function removeAssociationHandler(relation, cur) {
	displayConfirmation("Confirm to delete association with" + cur.entity.renderable.caption + " from " + relation.renderable.caption + "?");
	states.onConfirmationResponse = function(response) {
		states.shadower.style.setProperty("display", "none");
		document.getElementById("confirmation").style.setProperty("display", "none");
		states.commands["SYSTEM_KEY_ACTIVE"] = true;
		if(response) {
			for (var i = 0; i < relation.entities.length; ++i) {
				if(relation.entities[i].entity == cur.entity) {
					relation.entities.splice(i, 1);
					return;
				}
			}
		}
	}
}

function addLabelEvent(){
	states.highlightedStack = [];
	states.highlightedPositionVector = [];
	states.commands["SYSTEM_KEY_ACTIVE"] = false;
	document.getElementById("add-label-form").style.setProperty("display", "block");
	states.shadower.style.setProperty("display", "block");
	document.getElementById("add-label-caption").value = "label";
	document.getElementById("add-label-caption").select();
	document.getElementById("add-label-caption").focus();
}

function addLabelHandler() {
	states.shadower.style.setProperty("display", "none");
	document.getElementById("add-label-form").style.setProperty("display", "none");
	var caption = document.getElementById("add-label-caption").value;
	var label = new Shapes(100, 100, caption);
	states.elementOnFocus = label;
	states.labels.push(label);
	states.commands["PLACING_ITEM"] = true;
	setNotification("Left-click to place the label");
	states.onItemPlacedHandler = function() {
	}
}

function changeCaptionEvent() {
	states.highlightedStack = [];
	states.highlightedPositionVector = [];
	states.commands["SYSTEM_KEY_ACTIVE"] = false;
	states.chooserChecker = function() {
		return states.elementOnFocus != false && (states.elementOnFocus.constructor == Relation ? !states.elementOnFocus.isIsaRelationship : true);
	}

	states.chosenHandler = function() {
		var item = states.elementOnFocus;
		states.commands["SYSTEM_KEY_ACTIVE"] = false;
		document.getElementById("entity-chooser").style.setProperty("display", "none");
		document.getElementById("shadow-menu").style.setProperty("display", "none");
		document.getElementById("change-caption-form").style.setProperty("display", "block");
		states.shadower.style.setProperty("display", "block");
		document.getElementById("change-caption").value = (item.constructor == Shapes ? item.caption : item.renderable.caption);
		document.getElementById("change-caption").select();
		document.getElementById("change-caption").focus();
	}

	if(states.chooserChecker()) {
		states.chosenHandler();
	} else {
		states.commands["CHOOSING_ENTITY"] = true;
		document.getElementById("entity-chooser").style.setProperty("display", "block");
		document.getElementById("chooser-label").innerHTML = "Choose the <span style='color:orange'>caption</span> to be changed";
		document.getElementById("shadow-menu").style.setProperty("display", "block");
	}
}

function changeCaptionHandler() {
	states.commands["SYSTEM_KEY_ACTIVE"] = true;
	states.shadower.style.setProperty("display", "none");
	document.getElementById("change-caption-form").style.setProperty("display", "none");

	if (states.elementOnFocus.constructor == Shapes) {
		states.elementOnFocus.caption = document.getElementById("change-caption").value;
	} else {
		states.elementOnFocus.renderable.caption = document.getElementById("change-caption").value;
	}
}

function getDiagramEvent() {
	states.commands["SYSTEM_KEY_ACTIVE"] = false;
	document.getElementById("get-image-form").style.display = "block";
	states.shadower.style.display = "block";
	document.getElementById("get-image-name").value = "diagram";
	document.getElementById("get-image-name").select();
	document.getElementById("get-image-name").focus();
	
}

function getDiagram() {
	var image = states.screen.toDataURL("image/png");
	document.getElementById("get-image-form").style.display = "none";
	document.getElementById("download-image").style.display = "block";
	document.getElementById("download-image-link").href = image;
	document.getElementById("download-image-caption").innerHTML = "Click here to download " + document.getElementById("get-image-name").value;
	document.getElementById("download-image-link").download = document.getElementById("get-image-name").value;
}

function testerCode() {
	var e1 = new Entity(100, 100, "Students");
	var e2 = new Entity(300, 300, "Beers");
	e1.setWeak();
	e1.addAttribute(new Attribute(100, 50, "name")).addAttribute(new Attribute(40, 100, "nric"));
	e2.addAttribute(new Attribute(350, 350, "name")).addAttribute(new Attribute(350, 250, "price"));
	states.entities.push(e1);
	states.entities.push(e2);
	var e3 = new Entity(500, 500, "Courses");
	states.entities.push(e3);
	var r = new Relation(240, 240, "fav_beer");
	r.addEntity(e1, "R");
	r.addEntity(e2, "1");
	states.relations.push(r);
	var r2 = new Relation(700, 300, "SelfNameBlahBlahBlah");
	r2.addEntity(e3, "R");
	r2.addEntity(e3, "1");
	states.relations.push(r2);
}