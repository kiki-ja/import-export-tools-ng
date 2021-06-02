// background.js - this kicks off the WindowListener framework

console.debug('iet_tests Start');


var bPage;

var m = 0;
var s = "hello";
async function traverseFolders(rootFolderPath) {

	console.debug('traverse ' + bPage.t);
	bPage.t = 0;
	m = 0;
	let accountID = "account1";
	let account = await messenger.accounts.get(accountID);
	var folders = account.folders;
	var fArray = [];
	// console.log(JSON.stringify(folders, null, 2));

	// console.debug(`count ${await getMsgCount(folders[2])}`);
	let fa = await walkFolders_usePromiseAll(folders, getMsgCount);
	console.debug(fa);
	console.debug(`m total ${m}`);
	await getMsgCount2(folders[4]);
}

async function getMsgCount(folder) {
	let accountID = "account1";
	// let account = await messenger.accounts.get(accountID);
	// var folders = account.folders;
	var count = 0;
	let page = await messenger.messages.list(folder);
	// console.debug(page);
	// console.debug(page.messages.length);
	count+= page.messages.length;
	while (page.id) {
		page = await messenger.messages.continueList(page.id);
		// console.debug(page.messages.length);
		count+= page.messages.length;
	}
	// console.debug('total ' + count +' ' + m);
	m = m + count;
	bPage.t += count;
	// console.debug('gm ' + bPage.t);
	return count;
}

async function getMsgCount2(folder) {
	let accountID = "account1";
	console.debug(folder.path);
	// let account = await messenger.accounts.get(accountID);
	// var folders = account.folders;
	var count = 0;
	
	var totalFolder = 0;

	let page = await messenger.messages.list(folder);
	// console.debug(page);
	// console.debug(page.messages.length);
	// page.messages.forEach(async message => {
		for (let msg of page.messages) {
			let m = await messenger.messages.getFull(msg.id);
			console.debug(m.size);
		// 	totalFolder += m.size;
	
		}

		count += page.messages.length;

		while (page.id && count < 200) {
		page = await messenger.messages.continueList(page.id);
		// console.debug(page.messages.length);
		count += page.messages.length;
		for (let msg of page.messages) {
			let m = await messenger.messages.getFull(msg.id);
			console.debug(m.size);
			console.debug(m.subject);
			totalFolder += m.size;
	
		}

		console.debug(page.id);
		
	}
	// console.debug('total ' + count + ' ' + m);
	m = m + count;
	bPage.t += count;
	// console.debug('gm ' + bPage.t);
	return {msgCount: count, size: totalFolder};
}


async function walkFolders2(folders, cb) {
	console.debug('walk F');
	console.log(JSON.stringify(folders, null, 2));
	console.debug('after');

	var folderPromises = [];

	folders.forEach(async folder => {
		let mc = 3;
		folderPromises.push({ path: folder.path, msgCount: mc });
		console.debug(`FP ${folder.path} ${folder.subFolders}`);

		if (folder.subFolders.length) {
			var fp2 = [];
			folder.subFolders.forEach(async folder => {
				console.debug('recursive call ');
				let mc = 4;
				console.debug(`S FP ${folder.path} ${folder.subFolders}`);
				console.log(JSON.stringify(folder.subFolders, null, 2));
				// console.debug(folder.path);
				let fp = walkFolders(folder.subFolders, cb);
				console.log(JSON.stringify(fp, null, 2));
				fp2 = fp2.concat(fp);
				// console.debug('fp2');
				// console.debug(fp2);
				// console.debug(fp2[0]);
				console.log(JSON.stringify(fp2, null, 2));
				// console.debug(fp2[0].result);
			});

			let rfp2 = await Promise.all(fp2);
			console.debug('rf2');
			console.log(JSON.stringify(rfp2, null, 2));
			return rfp2;
			// console.debug(rfp2);
			console.debug('before fo ');
			console.debug(folderPromises);
			folderPromises = folderPromises.concat(rfp2);
			console.debug('after fo ');
			console.debug(folderPromises);

			return folderPromises;
		}
	});
	console.log(JSON.stringify(folderPromises, null, 2));
	return folderPromises;
}


async function walkFolders(folders, cb) {
	console.debug('walk F');
	// console.log(JSON.stringify(folders, null, 2));
	// console.debug('after');

	var fs = [];

	for (let i = 0; i < folders.length; i++) {
		const folder = folders[i];

		let mc = await getMsgCount(folder);
		console.debug(folder.path + ' ' + i);

		fs.push({ path: folder.path, msgCount: mc });

		console.debug(`FP ${folder.path} `);
		console.log(JSON.stringify(folder.subFolders, null, 2));
		console.debug('after FP');
		if (folder.subFolders.length) {

			var fs2 = [];
			for (let i = 0; i < folder.subFolders.length; i++) {
				const sfolder = folder.subFolders[i];

				let mc = await getMsgCount(sfolder);
				fs.push({ path: sfolder.path, msgCount: mc });
				console.debug(`R FP ${sfolder.path}`);

				// console.debug('Wf recursive call ');
				if (sfolder.subFolders.length) {
					console.debug(`S FP ${sfolder.path} ${folder.subFolders}`);
					console.log(JSON.stringify(sfolder.subFolders, null, 2));
					// fs2 = fs2.concat(walkFolders(sfolder.subFolders, cb));
					let fs3 = await walkFolders(sfolder.subFolders, cb);
					if (fs3) {
						fs2 = fs2.concat(fs3);

					}
				}

				// console.log(JSON.stringify(fs, null, 2));
			};

			let rfs2 = await Promise.all(fs2);
			console.debug(rfs2);
			if (rfs2[0]) {
				fs = fs.concat(rfs2[0]);

			}
			// fs = fs.concat(rfs2);
			console.debug('after promise all ');
			console.log(JSON.stringify(fs, null, 2));

		}
	};
	// return fs.concat(fp2);
	return fs;
}


async function walkFolders_usePromiseAll(folders, cb) {
	var fs = [];
	console.debug(`walkFolders: ${folders.length}`);

	let fdata_promisses = [];
	let subfolders_promisses = [];
	for (let folder of folders) {
        fdata_promisses.push(cb(folder));
        subfolders_promisses.push(walkFolders_usePromiseAll(folder.subFolders, cb));
	}
	// await everything
	let fdata_rv = await Promise.all(fdata_promisses);
	let subfolders_rv = await Promise.all(subfolders_promisses);

	// prepare return value, we need to use index again :-(
	for (let i=0; i < folders.length; i++) {
		fs.push({
            accountId: folders[i].accountId,
            path: folders[i].path,
            fData: fdata_rv[i],
        });
	
        // Using the spread operator here as I do not like concat, which creates a new array.
        // All I want is to push all the elements of subfolders into fs and the spread operator
        // is doing just that, as push supports multiple elements to be pushed.        
        fs.push(...subfolders_rv[i]);
	};
	
	return fs;
}


function walkFoldersSimple(folders, cb) {
	console.debug('walk F');
	// console.log(JSON.stringify(folders, null, 2));
	// console.debug('after');

	var fs = [];

	folders.forEach(folder => {
		let mc = 3;
		fs.push({ path: folder.path, msgCount: mc });
		console.debug(`FP ${folder.path} ${folder.subFolders}`);

		if (folder.subFolders.length) {

			var fs2 = [];
			folder.subFolders.forEach(folder => {
				fs.push({ path: folder.path, msgCount: mc });
				console.debug(`FP ${folder.path} ${folder.subFolders}`);

				console.debug('Wf recursive call ');
				console.debug(`S FP ${folder.path} ${folder.subFolders}`);
				console.log(JSON.stringify(folder.subFolders, null, 2));
				fs2 = fs2.concat(walkFolders(folder.subFolders, cb));
				console.log(JSON.stringify(fs, null, 2));
			});
			fs = fs.concat(fs2);
		}
	});
	console.log(JSON.stringify(fs, null, 2));
	// return fs.concat(fp2);
	return fs;
}


window.addEventListener("load", async function (event) {
	bPage = await browser.runtime.getBackgroundPage();
	bPage.t = 2;
	// await getMsgCount(folder);
	console.debug(`load ${bPage.t}`);

	// await traverseFolders();
	console.debug(`load finish ${bPage.t}`);
});


messenger.NotifyTools.onNotifyBackground.addListener(async (info) => {
	switch (info.command) {
	  case "doTest":
		//   Services.console.logStringMessage("mboximport_tests background");
		console.debug('check state');
		console.debug(new Date());
		await traverseFolders();
		console.debug(new Date());
		console.debug(bPage.t);
		// bPage.t += 2;
		return bPage.t;
	  break;
	  case "doTest2":
		//   Services.console.logStringMessage("mboximport_tests background");
		console.debug('check sent');
		console.debug(new Date());
		await getMsgCount2("\\Sent");
		console.debug(new Date());
		console.debug(bPage.t);
		// bPage.t += 2;
		return bPage.t;
	  break;

	}
  });
