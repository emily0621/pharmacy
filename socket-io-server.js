const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
})

io.on("connection", (socket) => {
  console.log('Successfully connected')

  socket.emit('send message', {message: 'message1 from user1', author: 'user', to: 'admin', from: 'eagerOcelot1'})
  socket.emit('send message', {message: 'message1', author: 'admin', to: 'eagerOcelot1', from: 'admin'})
  socket.emit('send message', {message: 'message1 from user2', author: 'user', to: 'admin', from: 'ferventRice9'})
  socket.emit('send message', {message: 'message2', author: 'admin', to: 'eagerOcelot1', from: 'admin'})
  socket.emit('send message', {message: 'message3', author: 'admin', to: 'ferventRice9', from: 'admin'})
  socket.emit('send message', {message: 'message2 from user1', author: 'user', to: 'admin', from: 'eagerOcelot1'})

  socket.onAny((event, message) => {
    socket.emit(event, message)
  });
});

httpServer.listen(3000, () => {
  console.log('Port 3000')
});
