function preventTextAreaTab() {
	var textarea = document.getElementsByTagName('textarea');
	$(textarea).each(function () {
		$(this).keydown(function (eve) {
			if (eve.target != this)
				return;
			if (eve.keyCode == 13)
				last_blanks = getCurrentLineBlanks(this);
			else if (eve.keyCode == 9) {
				eve.preventDefault();
				insertAtCursor(this, "  ");
				this.returnValue = false;
			}
		}).keyup(function (eve) {
			if (eve.target == this && eve.keyCode == 13) {

			}
		});
	});
};

function insertAtCursor(obj, txt) {
	obj.focus();
	//IE support
	if (document.selection) {
		sel = document.selection.createRange();
		sel.text = txt;
	}
	//MOZILLA/NETSCAPE support
	else {
		var startPos = obj.selectionStart;
		var scrollTop = obj.scrollTop;
		var endPos = obj.selectionEnd;
		obj.value = obj.value.substring(0, startPos) + txt + obj.value.substring(endPos, obj.value.length);
		startPos += txt.length;
		obj.setSelectionRange(startPos, startPos);
		obj.scrollTop = scrollTop;
	}
}
function getCaretPos(ctrl) {
	var caretPos = 0;
	if (document.selection) {
		// IE Support
		var range = document.selection.createRange();
		// We'll use this as a 'dummy'
		var stored_range = range.duplicate();
		// Select all text
		stored_range.moveToElementText(ctrl);
		// Now move 'dummy' end point to end point of original range
		stored_range.setEndPoint('EndToEnd', range);
		// Now we can calculate start and end points
		ctrl.selectionStart = stored_range.text.length - range.text.length;
		ctrl.selectionEnd = ctrl.selectionStart + range.text.length;
		caretPos = ctrl.selectionStart;
	} else if (ctrl.selectionStart || ctrl.selectionStart == '0')
	// Firefox support
		caretPos = ctrl.selectionStart;
	return (caretPos);
}

function getCurrentLineBlanks(obj) {
	var pos = getCaretPos(obj);
	var str = obj.value;
	var i = pos - 1;
	while (i >= 0) {
		if (str.charAt(i) == '\n')
			break;
		i--;
	}
	i++;
	var blanks = "";
	while (i < str.length) {
		var c = str.charAt(i);
		if (c == ' ' || c == '\t')
			blanks += c;
		else
			break;
		i++;
	}
	return blanks;
}
function setCursorPos(inputObj, pos) {

	if (navigator.userAgent.indexOf("MSIE") > -1) {
		var range = document.selection.createRange();
		var textRange = inpObj.createTextRange();
		textRange.moveStart('character', pos);
		textRange.collapse();
		textRange.select();
	} else {
		inputObj.setSelectionRange(n, n);
	}
}
function getCursorPos(inputObj) {
	if (navigator.userAgent.indexOf("MSIE") > -1) { // IE
		var range = document.selection.createRange();
		range.text = '';
		range.setEndPoint('StartToStart', inpObj.createTextRange());
		return range.text.length;
	} else {
		return inputObj.selectionStart;
	}
}