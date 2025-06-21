const { Server } = require('socket.io');
const http = require('http');
const fs  = require('fs');

function startStashServer(patchPath) {
  const server = http.createServer();
  const io = new Server(server);

  io.on('connection', socket => {
    console.log('Client connected');

    socket.on('request-stash', () => {
      const patch = fs.readFileSync(patchPath);
      socket.emit('stash-data', patch.toString());
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  server.listen(4949, () => {
    console.log('StashShare server running on port 4949');
  });

  return () => server.close(); // return shutdown function
}

module.exports = {
  startStashServer
}
