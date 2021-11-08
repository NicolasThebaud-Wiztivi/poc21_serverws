const ws = require("ws");
const WebSocketServer = ws.WebSocketServer;

const wss = new WebSocketServer({ port: 8080 });

console.warn("× listening on port 8080");

wss.on("connection", (ws) => {
  console.warn("××", "connected!");
  
  ws.on("message", (data) => {
    if (Buffer.isBuffer(data)) {
      const rawData = JSON.parse(data);
      
      if (rawData.topic && Parser[rawData.topic]) {
        Parser[rawData.topic](rawData, ws);
      }
    }
  });

  ws.send("connection successful");
});


const Parser = {
    
  updateLast: (data) => {
    console.warn("××#updateLast", data);
    
    wss.clients
      .forEach((client) => {
      if (client.readyState === ws.OPEN && (client.roleID === undefined || client.roleID !== roles_enum.CALLER)) {
          console.warn("×> send to client", data);
          client.send(Buffer.from(JSON.stringify(data)));
      }
    });
  },
  
  role: (data, ws) => {
    console.warn("××#role", data);
    
    if (Object.values(roles_enum).includes(data)) {
      ws.roleID = data;
    }
  }
}


/// ROLES
const roles_enum = {
  CALLER: "1" // a caller socket client is not sent any message
}