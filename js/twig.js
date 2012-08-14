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
		this.placeholder = $('#' + id);
		
		this.commands = {
			undo:{name:'Undo', cmd:'undo', ui:false, value:null, icon: "data:image/gif;base64,R0lGODlhFgAWAOMKADljwliE33mOrpGjuYKl8aezxqPD+7/I19DV3NHa7P///////////////////////yH5BAEKAA8ALAAAAAAWABYAAARR8MlJq7046807TkaYeJJBnES4EeUJvIGapWYAC0CsocQ7SDlWJkAkCA6ToMYWIARGQF3mRQVIEjkkSVLIbSfEwhdRIH4fh/DZMICe3/C4nBQBADs="},
			redo:{name:'Redo', cmd:'redo', ui:false, value:null, icon: "data:image/gif;base64,R0lGODlhFgAWAMIHAB1ChDljwl9vj1iE34Kl8aPD+7/I1////yH5BAEKAAcALAAAAAAWABYAAANKeLrc/jDKSesyphi7SiEgsVXZEATDICqBVJjpqWZt9NaEDNbQK1wCQsxlYnxMAImhyDoFAElJasRRvAZVRqqQXUy7Cgx4TC6bswkAOw==" },
			clear:{name:'Remove Formatting', cmd:'removeFormat', ui:false, value:null, icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABGdBTUEAALGPC/xhBQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAAd0SU1FB9oECQMCKPI8CIIAAAAIdEVYdENvbW1lbnQA9syWvwAAAuhJREFUOMtjYBgFxAB501ZWBvVaL2nHnlmk6mXCJbF69zU+Hz/9fB5O1lx+bg45qhl8/fYr5it3XrP/YWTUvvvk3VeqGXz70TvbJy8+Wv39+2/Hz19/mGwjZzuTYjALuoBv9jImaXHeyD3H7kU8fPj2ICML8z92dlbtMzdeiG3fco7J08foH1kurkm3E9iw54YvKwuTuom+LPt/BgbWf3//sf37/1/c02cCG1lB8f//f95DZx74MTMzshhoSm6szrQ/a6Ir/Z2RkfEjBxuLYFpDiDi6Af///2ckaHBp7+7wmavP5n76+P2ClrLIYl8H9W36auJCbCxM4szMTJac7Kza////R3H1w2cfWAgafPbqs5g7D95++/P1B4+ECK8tAwMDw/1H7159+/7r7ZcvPz4fOHbzEwMDwx8GBgaGnNatfHZx8zqrJ+4VJBh5CQEGOySEua/v3n7hXmqI8WUGBgYGL3vVG7fuPK3i5GD9/fja7ZsMDAzMG/Ze52mZeSj4yu1XEq/ff7W5dvfVAS1lsXc4Db7z8C3r8p7Qjf///2dnZGxlqJuyr3rPqQd/Hhyu7oSpYWScylDQsd3kzvnH738wMDzj5GBN1VIWW4c3KDon7VOvm7S3paB9u5qsU5/x5KUnlY+eexQbkLNsErK61+++VnAJcfkyMTIwffj0QwZbJDKjcETs1Y8evyd48toz8y/ffzv//vPP4veffxpX77z6l5JewHPu8MqTDAwMDLzyrjb/mZm0JcT5Lj+89+Ybm6zz95oMh7s4XbygN3Sluq4Mj5K8iKMgP4f0////fv77//8nLy+7MCcXmyYDAwODS9jM9tcvPypd35pne3ljdjvj26+H2dhYpuENikgfvQeXNmSl3tqepxXsqhXPyc666s+fv1fMdKR3TK72zpix8nTc7bdfhfkEeVbC9KhbK/9iYWHiErbu6MWbY/7//8/4//9/pgOnH6jGVazvFDRtq2VgiBIZrUTIBgCk+ivHvuEKwAAAAABJRU5ErkJggg=="  },
			bold:{name:'Bold', cmd:'bold', ui:false, value:null, icon: "data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAInhI+pa+H9mJy0LhdgtrxzDG5WGFVk6aXqyk6Y9kXvKKNuLbb6zgMFADs=" },
			italic:{name:'Italic', cmd:'italic', ui:false, value:null, icon: "data:image/gif;base64,R0lGODlhFgAWAKEDAAAAAF9vj5WIbf///yH5BAEAAAMALAAAAAAWABYAAAIjnI+py+0Po5x0gXvruEKHrF2BB1YiCWgbMFIYpsbyTNd2UwAAOw==" },
			underline:{name:'Underline', cmd:'underline', ui:false, value:null, icon: "data:image/gif;base64,R0lGODlhFgAWAKECAAAAAF9vj////////yH5BAEAAAIALAAAAAAWABYAAAIrlI+py+0Po5zUgAsEzvEeL4Ea15EiJJ5PSqJmuwKBEKgxVuXWtun+DwxCCgA7" },
			leftAlign:{name:'Left Align', cmd:'justifyleft', ui:false, value:null, icon: "data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIghI+py+0Po5y02ouz3jL4D4JMGELkGYxo+qzl4nKyXAAAOw==" },
			centerAlign:{name:'Center Align', cmd:'justifycenter', ui:false, value:null, icon: "data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIfhI+py+0Po5y02ouz3jL4D4JOGI7kaZ5Bqn4sycVbAQA7" },
			rightAlign:{name:'Right Align', cmd:'justifyright', ui:false, value:null, icon: "data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIghI+py+0Po5y02ouz3jL4D4JQGDLkGYxouqzl43JyVgAAOw==" },
			quote:{name:'Quote', cmd:'formatblock', ui:false, value:'blockquote', icon: "data:image/gif;base64,R0lGODlhFgAWAIQXAC1NqjFRjkBgmT9nqUJnsk9xrFJ7u2R9qmKBt1iGzHmOrm6Sz4OXw3Odz4Cl2ZSnw6KxyqO306K63bG70bTB0rDI3bvI4P///////////////////////////////////yH5BAEKAB8ALAAAAAAWABYAAAVP4CeOZGmeaKqubEs2CekkErvEI1zZuOgYFlakECEZFi0GgTGKEBATFmJAVXweVOoKEQgABB9IQDCmrLpjETrQQlhHjINrTq/b7/i8fp8PAQA7" },
			link:{name:'Hyperlink', cmd:'createlink', ui:true, value:null, prompt: 'To what url should this link go', defaultValue: 'http://www.google.com/', icon: "data:image/gif;base64,R0lGODlhFgAWAOMKAB1ChDRLY19vj3mOrpGjuaezxrCztb/I19Ha7Pv8/f///////////////////////yH5BAEKAA8ALAAAAAAWABYAAARY8MlJq7046827/2BYIQVhHg9pEgVGIklyDEUBy/RlE4FQF4dCj2AQXAiJQDCWQCAEBwIioEMQBgSAFhDAGghGi9XgHAhMNoSZgJkJei33UESv2+/4vD4TAQA7" },
			standaloneImage: {name:'Insert Image', cmd:'insertimage', ui:true, value:null, custom: true, icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAASCAYAAAC5DOVpAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH1wESDxIlPDPTOgAAAB10RVh0Q29tbWVudABDcmVhdGVkIHdpdGggVGhlIEdJTVDvZCVuAAABCElEQVR42q2UvW3DMBCFv2dphaQw4g1cuDRcaQRnIh0nygqsApUqtIEBF8kKMZiCCvRjiVGsXHOAgPv03iOPauoqA56AnMfrC/jMgWfgDdiugF2B1xzIgO3+cNw9SmrqCiAbWAsBIABa3KVufjP8R3rQOUOKAOdc+70rNXX1ArzvD8fdb8okYRYHzaITCZq6ugCnPym7r6Gy0XVIZ2TmsFZa7ErB0srKMlCWNqt4k1L2E/ZS67PKYtjRkmSE0IFDmAZOZtYHmRlmhmR471t4H5i4Z31QF3TsRVEA4L1H0t1pDmBjRcuAM7AxYGx1Cji7ASsW/QKccuAGXNvNX/ME3XLgAzj/x+P4DdCJjDzhNlZvAAAAAElFTkSuQmCC" },
			smiley: {name:'Insert Smiley', cmd:'insertimage', ui:true, value:null, custom: true, icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAACB0RVh0U29mdHdhcmUATWFjcm9tZWRpYSBGaXJld29ya3MgTVi7kSokAAAAFnRFWHRDcmVhdGlvbiBUaW1lADExLzA1LzA33bqJ2wAAAi9JREFUeJyVk8tLVHEUxz+/e2dGzWlCp2wxQykyiwQlw0JbhFJBEIEugqB90L5NLnr9A+3b1KZcxeiuxYTUoskQLc1ZJGXYSBk+ynnPvfecFlPqnaDHd3P48X2cc35wjKriw8KRHkzotmL3KXZc1UO9ShatTCOVm4HeT3O75cYXkDmaxNjDVJfB2wT1fhI2YsK4JoqqM95wbHnEH5C91kju2SLuWpzqR/4EhyiuNGVzbjzRNpAuWwBspcb+xQwQZB2bfDxsvR+rTZDpOw7yiuLMX827UXD2oyon7FtXWx/grHQiRR5OJrh+vx+Ano4Nn6GeMwgitFtqNXXhbQLwaDKxU8MnfQH1XMCq4IrpslQ19uu3Lw8t1uqFA9A84Auo54xRRCRm3Le9apdnd5TNA7Xu+RdQSPsXr+M2cnswzlx3NlDNxMDjf6Bq2MyHViy8fEZMeJtIzcaZSHf8ZphId3A32bP9rroWtnEzASE4KiZ6NqTfawGvY8wvRUm9SdB9OAvA/FIrH75E6O6sQuQcbD2hWDaIeKNGVanMHEpaWhwOsk6hHODe0/OkphzfBGf6G7hyqZ1me4XC58dUHRlvGZQRo6psTJ9ubNJ3izb5eMj6BqaBr84Qq4XaKgejQdqiQSgtUFx7TqlUyq6ua6LropZ9x1Scakuq6nDIyhOwKpjAXrAjqBqcSp5CIQd44y2DUndMu1B8ua9bhDsi2ueJxlUEY9ysQaYt492InJL53fofa8ocVmP9V6MAAAAASUVORK5CYII=" }
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
			var command = self.commands[cmd] || null, value;
			if (!command) return false;
			
			value = command.ui && !command.custom ? prompt(command.prompt, command.defaultValue): command.value;
			d.execCommand(command.cmd, command.ui, value)
		};
		
		this.generateControls = function(id){
			var str = '';
			if (!self.placeholder) return false;
			
			for (var cmd in self.commands){
				//It's better handle the exception seperately than to make this code more complex
				if (self.commands[cmd].custom) { continue  }
				str += '<img class="pointer command standard" data-cmd="'+ cmd + '" title="'+ self.commands[cmd].name +'" src="'+ self.commands[cmd].icon +'" />';
				str += self.commands[cmd].hidden ? self.commands[cmd].hidden:'';
			}
			
			//Handle the custom codes here
			//1. Insert image control
			str += self.insertStandaloneImageControl();
			str += self.insertSmileyControl();
			
			self.placeholder.html(str);
		};
		
		this.eventRegistry = function(){
			self.placeholder.on('click', '.command.standard', function(){
				var my = $(this), cmd = my.data('cmd');
				if (!self.isEmptySelection()) self.exec(cmd);
			});
			
			//Image insert handlers
			self.placeholder.on('click', '.command.image_control', function(){
				var my = $(this), pos = my.position(), 
					fileInput = my.siblings('input[type="file"]');
				fileInput.show()
					.css({position: 'absolute', top: pos.top + 25 + 'px', left: pos.left});
			});	
			
			//Smiley insert handler
			self.placeholder.on('click', '.command.smiley_control', function(){
				var my = $(this);
				my.siblings('.list').show();				
			});
			
			self.placeholder.on('click', '.smiley', function(){
				var my = $(this), img = my.children().get(0);
				self.commands.smiley.value = img.src;
				self.exec('smiley');
				my.parent().hide();				
			});
			
			self.placeholder.find('input.image_control.file').change(self.handleImageInsert);			
		};
		
		this.insertStandaloneImageControl = function(){
			var cmd = self.commands.standaloneImage, 
				str = "<div style='display:inline-block;width:auto;'>";
			str    += "<img class='pointer command image_control hide_on_click' src='"+ cmd.icon +"' data-cmd='"+ cmd.cmd +"'  title='"+ cmd.name +"' />";
			str    += "<input style='display:none;' class='image_control file' type='file' />";
			str    += "</div>";
			
			return str;
		};
		
		this.insertSmileyControl = function(){
			var cmd = self.commands.smiley, 
				str = "<div style='display:inline-block;width:auto;'>",
				smileyURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAACB0RVh0U29mdHdhcmUATWFjcm9tZWRpYSBGaXJld29ya3MgTVi7kSokAAAAFnRFWHRDcmVhdGlvbiBUaW1lADExLzA1LzA33bqJ2wAAAi9JREFUeJyVk8tLVHEUxz+/e2dGzWlCp2wxQykyiwQlw0JbhFJBEIEugqB90L5NLnr9A+3b1KZcxeiuxYTUoskQLc1ZJGXYSBk+ynnPvfecFlPqnaDHd3P48X2cc35wjKriw8KRHkzotmL3KXZc1UO9ShatTCOVm4HeT3O75cYXkDmaxNjDVJfB2wT1fhI2YsK4JoqqM95wbHnEH5C91kju2SLuWpzqR/4EhyiuNGVzbjzRNpAuWwBspcb+xQwQZB2bfDxsvR+rTZDpOw7yiuLMX827UXD2oyon7FtXWx/grHQiRR5OJrh+vx+Ano4Nn6GeMwgitFtqNXXhbQLwaDKxU8MnfQH1XMCq4IrpslQ19uu3Lw8t1uqFA9A84Auo54xRRCRm3Le9apdnd5TNA7Xu+RdQSPsXr+M2cnswzlx3NlDNxMDjf6Bq2MyHViy8fEZMeJtIzcaZSHf8ZphId3A32bP9rroWtnEzASE4KiZ6NqTfawGvY8wvRUm9SdB9OAvA/FIrH75E6O6sQuQcbD2hWDaIeKNGVanMHEpaWhwOsk6hHODe0/OkphzfBGf6G7hyqZ1me4XC58dUHRlvGZQRo6psTJ9ubNJ3izb5eMj6BqaBr84Qq4XaKgejQdqiQSgtUFx7TqlUyq6ua6LropZ9x1Scakuq6nDIyhOwKpjAXrAjqBqcSp5CIQd44y2DUndMu1B8ua9bhDsi2ueJxlUEY9ysQaYt492InJL53fofa8ocVmP9V6MAAAAASUVORK5CYII=';
			str    += "<img class='pointer command smiley_control hide_on_click' src='"+ smileyURI +"' data-cmd='"+ cmd.cmd +"'  title='"+ cmd.name +"' />";
			str    += "<div class='smiley_control list' style='display:none;'>";
			
			for(var i = 0; i < 15; i += 1){
				str += "<div class='smiley'><img src='http://www.fgbuddyicons.com/images/icons/smileys/smileys01.gif' /></div>"
			}
			
			str    += "</div></div>";
			return str;
		};
		
		this.handleImageInsert = function(e){
			var input = e.currentTarget;
			if (input.files && input.files[0]) {
				var reader = new FileReader();
				reader.onload = function(ev){
					self.commands.standaloneImage.value = ev.target.result;
					self.exec('standaloneImage');
					$(input).hide();
				};
				reader.readAsDataURL(input.files[0]);
			}
		};
		
		
		//Code courtesy of http://stackoverflow.com/a/5420409/1177441 by 
		//ThiefMaster - http://stackoverflow.com/users/298479/thiefmaster
		this.getBase64Image = function (img) {
			// Create an empty canvas element
			var canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;

			// Copy the image contents to the canvas
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0);

			// Get the data-URL formatted image
			// Firefox supports PNG and JPEG. You could check img.src to guess the
			// original format, but be aware the using "image/jpg" will re-encode the image.
			var dataURL = canvas.toDataURL("image/jpg");

			return dataURL;
		}
		
		this.init = function(){
			self.generateControls(id);
			self.eventRegistry();
		};
	}
	return twig;
})()

