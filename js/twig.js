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
	function twig(d, controlsId, editorId){
		var self = this;
		
		/* Start Stores */
		this.placeholder = $('#' + controlsId);
		this.editor = $('#' + editorId);
		this.enableSearch = false;
		this.selectionStore = null;
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
		
		//Dummy list of names
		this.nameList = ["Aarav","Aardra","Aariz","Aarti","Aarushi","Aarya","Aaryan","Aathan","Aatiksha","Aatmay","Aavansh","Abhash","Abhav","Abhay","Abheenava","Abhijeet","Abhijit","Abhilasha","Abhimanyu","Abhinay","Abhineet","Abhipray","Abhisek","Abhishek","Abinpaul","Aboli","Achar","Adhip","Adhira","Adhiti","Adhu","Adishwari","Adita","Adithiyaa","Adithya","Advika","Adviti","Adwitiya","Adya","Adyanshi","Adyna","Afi","Afilaj","Africawala","Agalya","Agam","Aggyey","Agrima","Agyeya","Ahsteyan","Aiham","Aindreeja","Aindrila","Aishi","Aishik","Aishna","Alok","Aloka","Altamash","Aman","Amanjeet","Amar","Amarchandra","Amardip","Amarendra","Amaria","Amarnath","Ambeek","Ameesha","Amil","Amirthalingam","Amit","Amiya","Amiyya","Amol","Amola","Amrish","Amruta","Anagha","Anal","Anala","Anamika","Anamitra","Anand","Aneesh","Anena","Aneri","Anesh","Angad","Angana","Angeni","Anika","Anil","Anila","Anima","Animeha","Animesh","Anindita","Anini","Anirban","Anirudh","Anish","Anisha","Anit","Anita","Anitush","Anjali","Anjan","Anjana","Anju","Anketsingh","Ankita","Ankith","Ankrit","Ankur","Aparajita","Aparna","Apnav","Appinakatte","Appinalatte","Apurwa","Arahvinth","Araiya","Aran","Aranis","Arav","Archan","Arghya","Arindam","Arinjay","Aritra","Arshatha","Artham","Arthin","Arujnee","Arularasu","Arumugam","Arush","Arushi","Aryan","Asha","Ashesh","Ashima","Ashis","Ashith","Ashlmo","Ashmita","Ashna","Ashrit","Ashrith","Ashruta","Ashu","Ashvita","Ashvitha","Ashwani","Ashwatharayana","Ashweeta","Asifa","Asikk","Asishna","Asmita","Asok","Aswin","Atharva","Athira","Atmaj","Atmaling","Atul","Atyati","Aumnshi","Aushma","Avaneet","Avani","Avanika","Avanish","Aveeth","Avijeeta","Avik","Avika","Avinash","Aviral","Avkash","Avneesh","Avneet","Avni","Avyukta","Awish","Ayalasomayajula","Ayoniza","Ayurshi","Ayushi","Barkhat","Barnali","Baskar","Beeba","Benj","Bethina","Bhadra","Bhagappa","Bhagesh","Bhagyashree","Bharath","Bharmal","Bharti","Bhavadharini","Bhavana","Bhavesh","Bhavik","Bhavika","Bhavishya","Bhavna","Chaitanya","Chaitra","Chandani","Chandni","Chandrapillai","Chandrasekhar","Chandresh","Chanista","Channaprasad","Charan","Charu","Charvak","Chasmi","Chaukhani","Cheveyo","Chhavi","Chhaya","Chinju","Chinmay","Chinnu","Chintamani","Chiraag","Chirayush","Chitra","Choodamani","Chorath","Choudrie","Chutiya","Darsh","Darshana","Darshil","Darshma","Dashvir","Daswathi","Deeba","Deeksha","Deep","Deepak","Deepankar","Deepanshi","Deepthi","Deepti","Dehir","Deivanayagame","Delisha","Deneshini","Deodatta","Dev","Devanand","Devansh","Devanshu","Devardhi","Devasing","Devendra","Devesh","Devika","Dhairyasheel","Diksha","Dikshan","Dil","Dilip","Dinabandhu","Dinakar","Dinesh","Dinikeshwari","Dipanjajn","Dipanjan","Dipankar","Dipender","Dipesh","Dipika","Dipti","Direshan","Disha","Divyang","Divyanka","Divyanksha","Diwakar","Dores","Dorodi","Doupi","Drishti","Durairaj","Durgeshree","Durja","Dushyant","Dwarakesh","Dwijesh","Elamaran","Elangkathir","Elangovan","Elsy","Emisha","Erenezhath","Esakimuthu","Eshan","Eshitha","Eshon","Eshwari","Eshwin","Etad","Ezhil","Ganesh","Gangasagar","Ganisha","Gannamani","Gaurav","Gauresh","Gauri","Gaury","Gautham","Gayathiry","Gayatri","Geeta","Geethika","Geethu","Gejarajan","Ghanashyam","Ghaskadbi","Ghulati","Giridhar","Giriraj","Girish","Gitanjali","Gnana","Gokul","Gomathi","Gonachigar","Gopalakrishnan","Gopee","Gopesh","Gopikanth","Gopikha","Gorinta","Harendra","Hari","Hariharan","Harikishan","Harish","Harishanker","Harita","Haritha","Harjaspal","Harseerat","Harsha","Harshada","Harshala","Honisha","Hosiar","Hricha","Hrihaan","Ibia","Ichcha","Ilaha","Ili","Imaiya","Imashal","Impana","Imthiyaz","Inder","Indira","Indra","Indragovind","Indumathi","Inika","Injesh","Ipsita","Ishaan","Ishan","Ishani","Ishita","Jaitha","Jakeer","Jakkam","Janaki","Janani","Janhavi","Janki","Jannat","Jasbir","Jasdeep","Jashn","Jaskanwal","Jaskarn","Jasman","Jaspreet","Jasreet","Jaswinder","Jathin","Kallidai","Kallupalli","Kalpesh","Kalyan","Kalyani","Kamalapriya","Kamaloudine","Kamalpreet","Kamdeva","Kamlender","Kamlesh","Kanaka","Kanakam","Kandakumar","Kanif","Kanifnath","Kankana","Kannan","Kanti","Kapil","Karamjit","Karan","Karishma","Karna","Karteeka","Karthik","Karthikeyan","Karunamoyi","Karunesh","Kasendran","Kashmira","Kasserika","Kaumdadebi","Kaustubh","Kautilya","Kavin","Kaviraj","Kavitha","Kayur","Kazeal","Kedar","Kedarnag","Keerthi","Keerthikar","Keko","Kelan","Kesar","Kesavan","Keshav","Kesher","Keshnie","Ketan","Kewal","Keya","Khade","Khadim","Khalee","Khambat","Khanak","Khatkhate","Khemendra","Khizar","Khorsheda","Kistnah","Kochak","Kodandaramaiah","Koganti","Kohade","Kollabathula","Komahan","Komal","Kopinesh","Korutla","Kosala","Kosha","Koushlendra","Koyel","Kranth","Kreasen","Krishanth","Krishitta","Krishnakishor","Krishtavati","Kshoni","Kudhail","Kudrat","Kuldeep","Kulwinder","Kumar","Kumaran","Kumaresh","Kumutha","Kunjalata","Kunjbihari","Kunwarji","Kush","Kushal","Kushan","Kushika","Kutuhal","Kuyilan","Lakshmi","Lalani","Lalit","Lalita","Langto","Larika","Lasya","Latha","Latish","Lavaniavarsha","Laven","Lavisha","Lavitha","Loganathan","Lokanath","Lokesh","Londa","Madhava","Madhubaala","Madhukar","Madhumati","Madhupa","Madhura","Madhuri","Madhusmitha","Madrimuthu","Madura","Mahadevan","Malvindar","Mamoon","Manali","Manasi","Mandakini","Mandanna","Mandar","Manjalkar","Manjula","Manmeet","Mannat","Manohari","Manoj","Manosathya","Mansi","Mansimran","Mansoor","Manthan","Manuja","Manvendra","Markisha","Marshika","Marutheesh","Masakali","Mathan","Mathur","Maulesh","Maulik","Mayil","Mayilvahan","Mayura","Mayuraksha","Medha","Medhawati","Meena","Meenakumari","Meenal","Meet","Megha","Meghamala","Meghraj","Meha","Mehul","Mennaxi","Midhila","Midhuna","Migara","Milaana","Milinda","Minal","Minimol","Mira","Mishiri","Mistry","Mitasha","Mitesh","Mithil","Mithran","Namita","Namitha","Namrata","Nandana","Nandeesh","Nandini","Nandip","Nandita","Narayan","Naren","Natarajan","Natiqua","Navami","Navaria","Naveen","Navi","Navin","Panny","Papia","Pappathi","Parakandy","Parakh","Parakkadavan","Parameshwara","Paramjit","Partha","Parthasarathy","Parvath","Parvathy","Parvesh","Pattema","Pavan","Pavinay","Pavithra","Pebria","Pegandran","Pozhilvallavan","Prabhat","Prabhjot","Prabhu","Prabu","Prachi","Prachur","Pradeep","Pradnesh","Pradnya","Pragandh","Prateek","Prathamesh","Pratheeksh","Prathibha","Prathik","Prathima","Prathinga","Prathyusha","Pratik","Pratima","Pratyaksha","Pravanthi","Pravantika","Pravar","Praveeta","Pravesh","Pravin","Preenan","Preethi","Preeti","Prehana","Premal","Premkumar","Premvati","Pretema","Previlla","Preythap","Prihana","Prikshit","Prio","Prisha","Pritha","Purewal","Purlene","Purmessory","Purvanjali","Purwai","Raghav","Raghu","Raghul","Raghvendra","Ragini","Ragoo","Railla","Rajat","Rajathi","Rajendra","Rajendran","Rajesh","Rajeshkanna","Rajib","Rajitha","Rajiv","Rajkarne","Rajkumar","Raju","Ravishek","Ravitej","Rawatie","Reena","Reet","Reetika","Rejinath","Rekhade","Renjithlal","Renu","Renyn","Reshma","Retnaguru","Revika","Sajan","Sajdin","Sajith","Saket","Sakhi","Saksham","Sakthikumar","Salendra","Salil","Salila","Salmaan","Samaira","Samakshi","Samanvi","Samar","Sambasivam","Sambya","Sameep","Samhitha","Sanuka","Sanvi","Sanvitha","Sanyal","Sanyog","Sarayu","Sarika","Sarita","Saritha","Sarohan","Sarvatha","Sarvesh","Sarvjit","Sathvik","Satishan","Satrajit","Satya","Satyam","Satyaveer","Saudamini","Saumitra","Saurav","Savar","Savita","Sharadha","Sharag","Sharat","Sharda","Sharddha","Shardha","Shashank","Shashikant","Shashikanth","Shaukat","Shavaani","Shavneet","Shazia","Sheba","Sheetal","Sheethi","Shefali","Shekesh","Shekhar","Shishir","Shivahari","Shivaharini","Shivam","Shivani","Shloke","Shlokh","Shoba","Shobha","Shona","Shorya","Shourin","Shovonpriya","Sinto","Sintu","Siri","Sirisha","Sitara","Smaranika","Smija","Smita","Smitha","Sneha","Snigdha","Sniya","Suvreet","Suyash","Suyasham","Swaminathan","Swapna","Swapnil","Swara","Swarendini","Swaroopa","Swathi","Swathin","Swati","Swechchha","Swetha","Syam","Symontee","Syon","Tauyanvi","Tayya","Tazmeena","Teghveer","Tehzeeb","Thagana","Thanappan","Thandaveswaran","Thangavelu","Thanigaivel","Thanika","Thanseer","Thanuj","Thashanaa","Thashli","Thilognee","Thimappaya","Thirukumaran","Thivian","Thobhan","Thomasine","Thotakurikishore","Thriushen","Thushanthana","Thushyanth","Thuvolen","Tipson","Tribhuwan","Trikesh","Trilok","Tripat","Tripti","Trisha","Trishala","Trupti","Tuhin","Tulika","Tummalapalli","Tushar","Tvishi","Tvishimun","Uppasetty","Usanthan","Usha","Ushma","Uthamaraja","Uthiran","Uthra","Vallabha","Vamshi","Vandana","Vannoshan","Vanshika","Varchas","Vardhaman","Varinder","Varsha","Varuna","Vasantha","Vasavi","Vasikaran","Vaswani","Vathsala","Vatsal","Vatsalya","Vedansh","Vedant","Vedashree","Veenu","Veer","Vineeth","Vinesh","Vineshree","Vinod","Vinoda","Vinodhini","Vinsfy","Vinusha","Vinyanka","Vipal","Vipin","Vipul","Virajitha","Virat","Virupakshudu","Visagan","Visesh","Vishaka","Vishesh","Vishmai","Vishwajeet","Vishwanath","Vismadh","Vismitha","Viswanathan","Vitastaa","Vivaan","Vivaani","Viveka","Vridhi","Vrishiakh","Yash","Yashanshi","Yashika","Yashmeeta","Yashmika","Yashodhan","Yashvi","Yashwanth","Yasmin","Yomine","Yosha","Yoshinee","Yothindra","Yothindrae","Yunyuni","Zakrzewski","Zalgaonker","Zemlicoff","Zingsho","Zoah","Zubina","Zymal"];
		/* End Stores */
		
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
		
		this.generateControls = function(controlsId){
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
			self.placeholder.on('mouseover', '.sa_img_container', function(){
				var my = $(this).find('.command.image_control'), pos = my.position(), 
					fileInput = my.siblings('div.file_container');
				fileInput.show()
					.css({position:'absolute', top: pos.top + 17 + 'px', left: pos.left});
			}).on('mouseout', '.sa_img_container', function(){
				var my = $(this).find('.command.image_control'), pos = my.position(), 
					fileInput = my.siblings('div.file_container');
				fileInput.hide();
			});	
			
			//Smiley insert handler
			self.placeholder.on('mouseover', '.sm_list_container', function(){
				var my = $(this).find('.command.smiley_control');
				my.siblings('.list').show();				
			}).on('mouseout', '.sm_list_container', function(){
				var my = $(this).find('.command.smiley_control');
				my.siblings('.list').hide();				
			});
			
			self.placeholder.on('click', '.smiley', function(){
				var my = $(this), img = my.children().get(0);
				self.commands.smiley.value = img.src;
				self.exec('smiley');
				my.parent().hide();				
			});
			
			self.placeholder.find('input.image_control.file').change(self.handleImageInsert);			
			
			//Handlers for the '@' search
			self.editor.keypress(function(e){
				if(e.which === 64 && e.shiftKey){ /* => @ */
					console.log(e, self.getSelection());
					self.enableSearch = true;
					self.selectionStore = self.getSelection();
				}
				if (e.which === 32){ /* Space */
					self.enableSearch = false;
					self.selectionStore = null;
				}
				
				setTimeout(self.performSearch, 150);
			});
		};
		
		this.insertStandaloneImageControl = function(){
			var cmd = self.commands.standaloneImage, 
				str = "<div class='sa_img_container' style='display:inline-block;width:auto;'>";
			str    += "<img class='pointer command image_control' src='"+ cmd.icon +"' data-cmd='"+ cmd.cmd +"'  title='"+ cmd.name +"' />";
			str    += "<div class='file_container' style='display:none;'><input class='image_control file' type='file' /></div>";
			str    += "</div>";
			
			return str;
		};
		
		this.insertSmileyControl = function(){
			var cmd = self.commands.smiley, 
				str = "<div class='sm_list_container'>",
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
					$(input).parent().hide();
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
		
		//This handles the search for nicknames
		this.performSearch = function(){
			//Check whether search is required
			if (!self.enableSearch){ return false; }
			
			//Get the position of the cursor where '@' was used
			//and start matching from next character
			var atStart = self.selectionStore.startOffset, 
				currentPos = self.getSelection().startOffset,
				searchString;
				
			atStart += atStart === 0 ? 1:2;
			searchString = self.editor.text().substr(atStart, currentPos);
			console.log(atStart, currentPos, searchString);
		};
		
		this.init = function(){
			self.generateControls(controlsId);
			self.eventRegistry();
		};
	}
	return twig;
})()

