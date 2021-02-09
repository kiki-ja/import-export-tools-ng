
/*
	ImportExportTools NG is a derivative extension for Thunderbird 60+
	providing import and export tools for messages and folders.
	The derivative extension authors:
		Copyright (C) 2019 : Christopher Leidigh, The Thunderbird Team

	The original extension & derivatives, ImportExportTools, by Paolo "Kaosmos",
	is covered by the GPLv3 open-source license (see LICENSE file).
		Copyright (C) 2007 : Paolo "Kaosmos"

	ImportExportTools NG is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// cleidigh - reformat, globals, services

/* global
PrintEngineCreateGlobals,
InitPrintEngineWindow,
printEngine,
OnLoadPrintEngine,
IETopenFPsync
*/

var { Services } = ChromeUtils.import('resource://gre/modules/Services.jsm');
Services.console.logStringMessage("profile start");
console.debug('profile import');
Services.console.logStringMessage(window);

var IETimportWizard = {

	bundle: Services.strings.createBundle("chrome://mboximport/locale/profilewizard.properties"),

	currentPage: 1,
	finalPage: 3,
	nextElement: null,
	backElement: null,
	canAdvance: false,

	check: function () {
		Services.console.logStringMessage("p2 c");
	},

	addObservers: function () {
		var element = document.querySelector('#page2');

		window.MutationObserver = window.MutationObserver
			|| window.WebKitMutationObserver
			|| window.MozMutationObserver;
		// Find the element that you want to "watch"
		var target = element,
			// create an observer instance
			observer = new MutationObserver(function (mutation) {
				/** this is the callback where you
					do what you need to do.
					The argument is an array of MutationRecords where the affected attribute is
					named "attributeName". There is a few other properties in a record
					but I'll let you work it out yourself.
				 **/
				Services.console.logStringMessage("profile mutation");
				Services.console.logStringMessage(mutation);
				console.debug(mutation);
				Services.console.logStringMessage(mutation[0]);
				console.debug(mutation[0]);
				target.onchange();
				console.debug('after');
			}),
			// configuration of the observer:
			config = {
				attributes: true // this is to watch for attribute changes.
			};
		// pass in the element you wanna watch as well as the options
		observer.observe(target, config);
		// later, you can stop observing
		// observer.disconnect();
	},
	
	cancel: function () {
		window.close();
	},

	next: function () {
		let cp = document.getElementById("page" + IETimportWizard.currentPage);
		let np = document.getElementById("page" + (IETimportWizard.currentPage + 1));
		IETimportWizard.currentPage += 1;
		cp.setAttribute("style", "display: none;");
		np.setAttribute("style", "display: inline;");
		// IETimportWizard.secondPage();
		// if (np.onchange) {
			np.onshow();
		// }
	},
	back: function () {
		Services.console.logStringMessage("profile Back");
		let cp = document.getElementById("page" + IETimportWizard.currentPage);
		let pp = document.getElementById("page" + (IETimportWizard.currentPage - 1));
		IETimportWizard.currentPage -= 1;
		cp.setAttribute("style", "display: none;");
		pp.setAttribute("style", "display: inline;");
		// IETimportWizard.secondPage();
		pp.onshow();

		Services.console.logStringMessage("profile Back finish");
	},

	start: function () {
		Services.console.logStringMessage("profile start page");
		Services.console.logStringMessage(window);
		// IETimportWizard.addObservers();
		// Services.console.logStringMessage(document.documentElement.outerHTML);
		// if (document.getElementById("pathBox").value.length === 0)
		// document.getElementById("profileImportWizard").canAdvance = false;
		IETimportWizard.backElement = document.getElementById("backButton");
		IETimportWizard.nextElement = document.getElementById("nextButton");
		IETimportWizard.canAdvance = false;
		if (document.getElementById("nameBox").value.length > 0 && document.getElementById("pathBox").value.length > 0) {
			IETimportWizard.nextElement.disabled = false;
		} else {
			IETimportWizard.nextElement.disabled = true;
		}
		IETimportWizard.backElement.disabled = true;
	},

	secondPage: function () {
		Services.console.logStringMessage("profile page 2");
		// document.getElementById("profileImportWizard").canAdvance = false;
		IETimportWizard.canAdvance = false;
		IETimportWizard.nextElement.disabled = true;
		IETimportWizard.backElement.disabled = false;
	},

	thirdPage: function () {
		Services.console.logStringMessage("profile page 3");
		document.getElementById("profileImportWizard").canRewind = false;
		document.getElementById("newProfDetails").textContent = IETimportWizard.bundle.GetStringFromName("profilePath") + "\r\n" + IETimportWizard.profDir.path;
		IETimportWizard.backElement = document.getElementById("backButton");
		IETimportWizard.nextElement = document.getElementById("nextButton");
		IETimportWizard.canAdvance = false;
		IETimportWizard.nextElement.disabled = true;
		IETimportWizard.backElement.disabled = true;
	
	},

	checkName: function (el) {
		if (el.value.length > 0 && document.getElementById("pathBox").value.length > 0) {
			// document.getElementById("profileImportWizard").canAdvance = true;
			IETimportWizard.nextElement.disabled = false;
			// IETimportWizard.backElement.disabled = false;
		} else {
			// document.getElementById("profileImportWizard").canAdvance = false;
			IETimportWizard.nextElement.disabled = true;
			IETimportWizard.backElement.disabled = true;
		}
	},

	pickFile: function (el) {
		var nsIFilePicker = Ci.nsIFilePicker;
		var fp = Cc["@mozilla.org/filepicker;1"]
			.createInstance(nsIFilePicker);
		var res;

		fp.init(window, IETimportWizard.bundle.GetStringFromName("pickProfile"), nsIFilePicker.modeGetFolder);
		if (fp.show)
			res = fp.show();
		else
			res = IETopenFPsync(fp);
		if (res === nsIFilePicker.returnOK) {
			var testFile = fp.file.clone();
			testFile.append("prefs.js");
			if (!testFile.exists()) {
				alert(IETimportWizard.bundle.GetStringFromName("noProfile"));
				return;
			}
			if (document.getElementById("nameBox").value.length > 0)
				document.getElementById("profileImportWizard").canAdvance = true;
			else
				document.getElementById("profileImportWizard").canAdvance = false;
			var box = document.getElementById("pathBox");
			box.value = fp.file.path;
			IETimportWizard.file = fp.file;
		}
	},

	runPM: function () {
		var ex = Cc["@mozilla.org/file/directory_service;1"]
			.getService(Ci.nsIProperties)
			.get("XREExeF", Ci.nsIFile);
		var args = [];
		args.push("-no-remote");
		args.push("-P");
		var process = Cc["@mozilla.org/process/util;1"]
			.createInstance(Ci.nsIProcess);
		process.init(ex);
		process.run(false, args, args.length);
		window.arguments[0].value = true;
		window.close();
	},

	importProfile: function (el) {
		el.disabled = true;
		document.getElementById("importRunning").hidden = false;
		document.getElementById("profileImportWizard").canRewind = false;
		setTimeout(IETimportWizard.importProfileDelayed, 1000);
	},

	importProfileDelayed: function () {
		var line = {}, lines = [], hasmore;

		try {
			var newProfName = document.getElementById("nameBox").value;
			var directory = IETimportWizard.file;
			var prefix = "";
			while (true) {
				var dirClone = directory.clone();
				var newDirName = (Math.random().toString(36).slice(2)).substring(0, 8) + ".IETimport";
				dirClone.append(newDirName);
				if (!dirClone.exists())
					break;
			}
			// Searching for profiles.ini file. It's located in DefProfRt on Linux but is in parent of DefProfRt on Windows
			var profilesIni1 = Cc["@mozilla.org/file/directory_service;1"]
				.getService(Ci.nsIProperties)
				.get("DefProfRt", Ci.nsIFile);
			var profilesIni = profilesIni1.clone();
			profilesIni.append("profiles.ini");
			if (!profilesIni.exists()) {
				profilesIni = profilesIni1.parent.clone();
				profilesIni.append("profiles.ini");
				prefix = "Profiles/";
			}
			var parser = Cc["@mozilla.org/xpcom/ini-parser-factory;1"]
				.getService(Ci.nsIINIParserFactory)
				.createINIParser(profilesIni);
			for (var i = 0; 1; ++i) {
				var section = "Profile" + i;
				var n;
				try {
					n = parser.getString(section, "Name");
				} catch (e) {
					break;
				}
			}
			var filex = Cc["@mozilla.org/file/directory_service;1"]
				.getService(Ci.nsIProperties)
				.get("DefProfRt", Ci.nsIFile);
			directory.copyTo(filex, newDirName);
			var profilesIni2 = profilesIni.parent.clone();
			profilesIni2.append("profiles.ini");
			var istream = Cc["@mozilla.org/network/file-input-stream;1"]
				.createInstance(Ci.nsIFileInputStream);
			istream.init(profilesIni2, 0x01, 0444, 0);
			istream.QueryInterface(Ci.nsILineInputStream);
			var profiles = 0;
			do {
				hasmore = istream.readLine(line);
				if (line.value.indexOf("[Profile") > -1)
					profiles++;
			} while (hasmore);
			istream.close();
			var data = "[Profile" + i + "]\nName=" + newProfName + "\nIsRelative=1\nPath=" + (prefix + newDirName) + "\n";
			var foStream = Cc["@mozilla.org/network/file-output-stream;1"]
				.createInstance(Ci.nsIFileOutputStream);
			foStream.init(profilesIni2, 0x02 | 0x08 | 0x10, 0664, 0);
			var converter = Cc["@mozilla.org/intl/converter-output-stream;1"].
				createInstance(Ci.nsIConverterOutputStream);
			converter.init(foStream, "UTF-8", 0, 0);
			converter.writeString(data);
			converter.close();
			var filez = Cc["@mozilla.org/file/directory_service;1"]
				.getService(Ci.nsIProperties)
				.get("DefProfRt", Ci.nsIFile);
			filez.append(newDirName);

			var fileToDelete = filez.clone();
			fileToDelete.append("panacea.dat");
			if (fileToDelete.exists())
				fileToDelete.remove(false);
			fileToDelete = filez.clone();
			fileToDelete.append("extensions.ini");
			if (fileToDelete.exists())
				fileToDelete.remove(false);
			fileToDelete = filez.clone();
			fileToDelete.append("compatibility.ini");
			if (fileToDelete.exists())
				fileToDelete.remove(false);
			fileToDelete = filez.clone();
			fileToDelete.append("downloads.rdf");
			if (fileToDelete.exists())
				fileToDelete.remove(false);
			fileToDelete = filez.clone();
			fileToDelete.append("pluginreg.dat");
			if (fileToDelete.exists())
				fileToDelete.remove(false);

			filez.append("prefs.js");
			istream.init(filez, 0x01, 0444, 0);
			istream.QueryInterface(Ci.nsILineInputStream);
			do {
				hasmore = istream.readLine(line);
				if (line.value.indexOf("browser.download.dir") < 0 && line.value.indexOf("browser.download.lastDir") < 0 &&
					line.value.indexOf("extensions.installCache") < 0 && line.value.indexOf("mail.root.imap") < 0 &&
					line.value.indexOf("mail.root.none") < 0 && line.value.indexOf("mail.root.pop3") < 0 &&
					line.value.indexOf('"editor.') < 0 && line.value.indexOf('"print.') < 0 && line.value.indexOf("mail.compose.attach.dir") < 0 &&
					line.value.indexOf("messenger.save.dir") && !line.value.match(/mail\.server\.server\d+\.directory[^\-]/))
					lines.push(line.value);
			} while (hasmore);
			istream.close();
			filez.copyTo(null, "prefs.js.bak");
			data = lines.join("\r\n");
			foStream.init(filez, 0x02 | 0x08 | 0x20, 0664, 0);
			foStream.write(data, data.length);
			foStream.close();
			document.getElementById("importEnd").hidden = false;
			document.getElementById("profileImportWizard").canAdvance = true;
			IETimportWizard.nextElement.disabled = false;
			IETimportWizard.backElement.disabled = true;
	
			IETimportWizard.profDir = filez.parent;
		} catch (e) {
			document.getElementById("errorDetails").textContent = e;
			document.getElementById("error").hidden = false;
			document.getElementById("errorDetails").hidden = false;
		}
	},
};
