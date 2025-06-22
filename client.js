const vscode = require('vscode');
const {io} = require('socket.io-client');
const { execSync } = require('child_process');

function isInsideGitRepo(cwd) {
  try {
    const output = execSync('git rev-parse --is-inside-work-tree', { cwd }).toString().trim();
    return output === 'true';
  } catch {
    return false;
  }
}
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
  await vscode.workspace.fs.writeFile(patchUri, Buffer.from(patch, 'utf8'));

  vscode.window.showInformationMessage(`Stash received. Saving to your stash list...`);

  const patchPath = patchUri.fsPath;
  const cwd = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

  if (!cwd) {
    vscode.window.showErrorMessage('No Git repo open. Please open a folder with Git initialized.');
    return;
  }
  if (!isInsideGitRepo(cwd)) {
  vscode.window.showErrorMessage('The current folder is not a Git repository.');
  return;
}

  try {
    execSync(`git apply "${patchPath}"`, { cwd });
    execSync(`git stash push -m "Received from StashShare"`, { cwd });
    // execSync(`git reset --hard`, { cwd });

    vscode.window.showInformationMessage(`Stash saved successfully.`);
  } catch (err) {
    vscode.window.showErrorMessage(`Failed to stash received patch: ${err.message}`);
  }

    socket.disconnect();
  });

  socket.on('connect_error', () => {
    vscode.window.showErrorMessage('Failed to connect to sender machine');
  });
}

module.exports = {
  receiveStash
};
