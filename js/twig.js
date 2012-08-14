/* 
	A simple implementation of a WYSIWIG editor
	Staying true to the principle, and more to the fact that I don't like iframes,
	let's use 'contentEditable'. This creates a few minor issues, but nothing that can't be 
	handled. Cheers.
*/

//These are the function lists -
//We will be using the 'execCommand' function available on the 'document'
//for applying all the styles.

var twig = (function twig(){
	function twig(d, id){
		var self = this;
		
		this.commands = {
			bold:{name:'Bold', cmd:'bold', ui:false, value:null},
			italic:{name:'Italic', cmd: 'italic', ui:false, value:null},
			underline:{name:'Underline', cmd: 'underline', ui:false, value:null},
			blockquote:{name:'Blockquotes', cmd: 'formatblock', ui:false, value:'blockquote'},
		};
		
		this.getSelection = function(){
			var sel;
			if (window.getSelection) {
				sel = window.getSelection();
				if (sel.rangeCount) {
					return sel.getRangeAt(0);
				}
			} else if (document.selection) {
				return document.selection.createRange();
			}
			return null;
		};
		
		this.setSelection = function(){
			self.getSelection().removeAllRanges();
			self.getSelection().addRange(self.selection);
		};
		
		this.isEmptySelection = function(){
			var selection = self.getSelection();
			return selection.startOffset === selection.endOffset;
		};
		
		this.exec = function(cmd){
			var command = self.commands[cmd] || null;
			if (!command) return false;
			
			//Deal with commands that doent require a UI first
			if (!command.ui){
				console.log(command)
				d.execCommand(command.cmd, command.ui, command.value)
			}
		};
		
		this.generateControls = function(id){
			var placeholder = $('#' + id), str = '';
			if (!placeholder) return false;
			
			for (var cmd in self.commands){
				str += '<button data-cmd="'+ self.commands[cmd].cmd +'">' + self.commands[cmd].name + '</button>';
			}
			
			placeholder.html(str);
			
			placeholder.on('click', 'button', function(){
				var my = $(this), cmd = my.data('cmd');
				if (!self.isEmptySelection()) self.exec(cmd);
			});
		};
		
		this.init = function(){
			self.generateControls(id);
		};
	}
	return twig;
})()

