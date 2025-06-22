// The module 'vscode' contains the VS Code extensibility API

const { startStashServer } = require('./server');
const { receiveStash } = require('./client');

// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { execSync } = require('child_process');

function getGitStashes() {
	try {
		const result = execSync('git stash list', { cwd: vscode.workspace.rootPath }).toString();
		return result.trim().split('\n').filter(Boolean);
	} catch (err) {
		vscode.window.showErrorMessage('Failed to get git stashes');
		return [];
	}
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const share = vscode.commands.registerCommand('share-stash.shareStash', async function () {
		const stashes = getGitStashes();
		// console.log('Available stashes:', stashes);
		if (stashes.length === 0) {
			vscode.window.showInformationMessage('No stashes available to share.');
			return;
		}
		const selected = await vscode.window.showQuickPick(stashes, {
			placeHolder: 'Select a stash to share',
		});

		if (selected) {
			const match = selected.match(/stash@\{\d+\}/);
			if (!match) return;
			const stashRef = match[0];
			const patchFile = vscode.Uri.joinPath(context.globalStorageUri, `stash-${Date.now()}.patch`);

			try {
				const patch = execSync(`git stash show -p ${stashRef}`, { cwd: vscode.workspace.rootPath });
				await vscode.workspace.fs.writeFile(patchFile, patch);
				vscode.window.showInformationMessage(`Patch created: ${patchFile.fsPath}`);

				const stopServer = startStashServer(patchFile.fsPath);
    			vscode.window.showInformationMessage('Stash server started. Waiting for receiver...');
    			setTimeout(() => {
      			stopServer();
      			vscode.window.showInformationMessage('stash server timeout - closed.');
    			}, 60000); // Auto close after 60s


				// TODO: send this patch to another machine
			} catch (err) {
				vscode.window.showErrorMessage('Failed to create patch');
			}
		}
		console.log('Selected stash:', selected);
		// vscode.window.showInformationMessage('Hello World from share stash updated!');
	});

	const recieve = vscode.commands.registerCommand('share-stash.receiveStash', async () => {
    await receiveStash(context);
});

	context.subscriptions.push(share);
	context.subscriptions.push(recieve);
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
