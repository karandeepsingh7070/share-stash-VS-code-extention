const vscode = require('vscode');
const {io} = require('socket.io-client');
async function receiveStash(context) {
  const host = await vscode.window.showInputBox({
    prompt: 'Enter IP address of the sender (e.g., 192.168.1.5)',
    placeHolder: 'IP address',
  });

  if (!host) return;

  const socket = io(`http://${host}:4949`);

  socket.on('connect', () => {
    vscode.window.showInformationMessage('Connected to StashShare server');
    socket.emit('request-stash');
  });

  socket.on('stash-data', async (patch) => {
    const patchUri = vscode.Uri.joinPath(context.globalStorageUri, `received-${Date.now()}.patch`);
    await vscode.workspace.fs.writeFile(patchUri, Buffer.from(patch));
    vscode.window.showInformationMessage(`Patch received and saved: ${patchUri.fsPath}`);

    // Apply patch
    const terminal = vscode.window.createTerminal(`Apply Patch`);
    terminal.sendText(`git apply "${patchUri.fsPath}"`);
    terminal.show();

    socket.disconnect();
  });

  socket.on('connect_error', () => {
    vscode.window.showErrorMessage('Failed to connect to sender machine');
  });
}

module.exports = {
  receiveStash
};
