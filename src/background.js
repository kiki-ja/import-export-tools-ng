import './vendor/html2canvas/html2canvas.js';
import './vendor/dompurify/purify.js';
import './vendor/jsPDF/jspdf.umd.js';

// Default export is a4 paper, portrait, using millimeters for units
//let raw = "<html ><p style='word-spacing: 2pt; font-size: 10pt; border:1pt solid red'>It may sound counterintuitive, but don’t cut your marketing budget in a recession. Here are 3 ways to increase your marketing effectiveness.</p></html>";
let raw = "<html><body><div style='border:1pt solid red'><p>It may sound counterintuitive, but don’t cut your marketing budget in a recession. Here are 3 ways to increase your marketing effectiveness.</p></div></body></html>";
let iframe = document.getElementById("frame").contentDocument;
iframe.body.innerHTML = raw;


/*var pdf = new jspdf.jsPDF('p','pt','a4');

pdf.fromHTML(iframe.body, function() {
	browser.downloads.download({
		'url': URL.createObjectURL(pdf.output('blob')),
		'filename': 'test.pdf',
		'saveAs': true,
	});
});*/


html2canvas(iframe.body).then(canvas => {
	
	var imgData = canvas.toDataURL(
		'image/png');              
	var doc = new jspdf.jsPDF('p', 'mm');
	doc.addImage(imgData, 'PNG', 10, 10);	

	browser.downloads.download({
		'url': URL.createObjectURL(doc.output('blob')),
		'filename': 'test.pdf',
		'saveAs': true,
	});
});


/*
let doc = new jspdf.jsPDF({ unit: "pt", format: "a4" });
var pWidth = doc.internal.pageSize.getWidth();
var pHeight = doc.internal.pageSize.getHeight();

doc.html(raw, {
	width: pWidth,
	windowWidth: pWidth,
	html2canvas: {
		//backgroundColor: 'lightyellow',
		width: pWidth, // this only affects backgroundColor, not content
		height: pHeight,
	},
  	callback: function (doc) {
		console.log(doc.output('blob'));
		browser.downloads.download({
			'url': URL.createObjectURL(doc.output('blob')),
			'filename': 'test.pdf',
			'saveAs': true,
		});
	}
});
//text("Hello world!", 10, 10);
//doc.save("a4.pdf");
*/

messenger.WindowListener.registerDefaultPrefs("defaults/preferences/prefs.js");

// Register all necessary content, Resources, and locales
messenger.WindowListener.registerChromeUrl([
	["content", "mboximport", "chrome/content/mboximport"],
	["resource", "mboximport", "chrome/", "contentaccessible=yes"],
	["locale", "mboximport", "en-US", "chrome/locale/en-US/mboximport/"],

	["locale", "mboximport", "ca", "chrome/locale/ca/mboximport/"],
	["locale", "mboximport", "da", "chrome/locale/da/mboximport/"],
	["locale", "mboximport", "de", "chrome/locale/de/mboximport/"],
	["locale", "mboximport", "es-ES", "chrome/locale/es-ES/mboximport/"],
	["locale", "mboximport", "fr", "chrome/locale/fr/mboximport/"],
	["locale", "mboximport", "gl-ES", "chrome/locale/gl-ES/mboximport/"],
	["locale", "mboximport", "hu-HU", "chrome/locale/hu-HU/mboximport/"],
	["locale", "mboximport", "hu-HG", "chrome/locale/hu-HG/mboximport/"],
	["locale", "mboximport", "hy-AM", "chrome/locale/hy-AM/mboximport/"],
	["locale", "mboximport", "it", "chrome/locale/it/mboximport/"],
	["locale", "mboximport", "ja", "chrome/locale/ja/mboximport/"],
	["locale", "mboximport", "ko-KR", "chrome/locale/ko-KR/mboximport/"],
	["locale", "mboximport", "nl", "chrome/locale/nl/mboximport/"],
	["locale", "mboximport", "pl", "chrome/locale/pl/mboximport/"],
	["locale", "mboximport", "pt-PT", "chrome/locale/pt-PT/mboximport/"],
	["locale", "mboximport", "ru", "chrome/locale/ru/mboximport/"],
	["locale", "mboximport", "sk-SK", "chrome/locale/sk-SK/mboximport/"],
	["locale", "mboximport", "sl-SI", "chrome/locale/sl-SI/mboximport/"],
	["locale", "mboximport", "sv-SE", "chrome/locale/sv-SE/mboximport/"],
	["locale", "mboximport", "zh-CN", "chrome/locale/zh-CN/mboximport/"],
	["locale", "mboximport", "el", "chrome/locale/el/mboximport/"],

]);

messenger.WindowListener.registerOptionsPage("chrome://mboximport/content/mboximport/mboximportOptions.xhtml");

// Register each overlay script Which controls subsequent fragment loading

messenger.WindowListener.registerWindow(
	"chrome://messenger/content/messenger.xhtml",
	"chrome://mboximport/content/mboximport/messengerOL.js");

messenger.WindowListener.registerWindow(
	"chrome://messenger/content/SearchDialog.xhtml",
	"chrome://mboximport/content/mboximport/SearchDialogOL.js");

messenger.WindowListener.registerWindow(
	"chrome://messenger/content/messengercompose/messengercompose.xhtml",
	"chrome://mboximport/content/mboximport/messengercomposeOL.js");


messenger.WindowListener.registerWindow(
	"chrome://messenger/content/messageWindow.xhtml",
	"chrome://mboximport/content/mboximport/messageWindowOL.js");

/* messenger.WindowListener.registerWindow(
	  "chrome://mboximport/content/mboximport/pest.xhtml",
	  "chrome://mboximport/content/mboximport/ptest.js"); */

/* messenger.WindowListener.registerWindow(
	"chrome://messenger/content/msgPrintEngine.xhtml",
	"chrome://mboximport/content/mboximport/msgPrintEngineOL.js"); */

messenger.WindowListener.startListening();
