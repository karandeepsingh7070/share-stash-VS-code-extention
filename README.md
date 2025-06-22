
# 🔄 StashShare - Share Git Stashes Instantly Between Machines

**StashShare** is a simple VS Code extension that lets developers **send and receive Git stashes over the local network**. Whether you're pairing with a teammate or working across machines, quickly move your stashed changes without using branches, commits, or patches manually.

---

## 🚀 Features

- 📤 Share a selected stash from your Git repo over LAN
- 📥 Receive a stash and save it safely to your own Git stash list
- 🕓 Auto shutdown of stash server after 60 seconds to prevent lingering sockets

---

## 💡 Use Case

You're working on one machine and have some changes stashed. You want to continue on another machine — just share the stash with **StashShare**, and it will appear in the new machine’s stash list. No git remotes, no GitHub — just fast, local sharing.

---

## 🧩 How to Use

### 🧑‍💻 1. Install the Extension

You can build and install manually:

```bash
npm install -g vsce
vsce package
code --install-extension stash-share-0.0.1.vsix
```

Or install from the Marketplace.

---

### 💾 2. Share a Stash (Sender)

1. Open your Git project in VS Code
2. Open Command Palette: `Ctrl+Shift+P` / `Cmd+Shift+P`
3. Run: **“StashShare: Share Stash”**
4. Select the stash you want to share
5. You'll get a message like:

   > “Stash server started on 192.168.1.10:4949”

📌 Keep this machine running while the other receives.

---

### 📲 3. Receive a Stash (Receiver)

1. Open your own Git project in VS Code
2. Open Command Palette
3. Run: **“StashShare: Receive Stash”**
4. Enter the **IP address of the sender machine**

   > Example: `192.168.1.10`
5. The stash will be received, saved to your own `git stash`.

---

## 🌐 Requirements

* Both machines must be on the **same Wi-Fi or LAN**
* Git must be installed and initialized in the workspace
* Ports must not be blocked (uses `4949`)

---

## 🤝 Contributing

Want to improve it? Open issues, PRs, or new ideas welcome!

## 📜 License

MIT © Karandeep Singh

