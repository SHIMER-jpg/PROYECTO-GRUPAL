// const express = require("express");
// const app = express();
// const server = require("http").createServer(app);
// const io = require("socket.io")(server);
const socketIO = require("socket.io");
const socket = {};
const server = require("./app.js");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// let rooms = [{id: 121sao92193jdf, users: [{}, {}, {}], card: {}, totalValue: 0, buttonsEnabled: false}];
let rooms = [];

io.on("connection", (socket) => {
  console.log("socket.io: User connected: ", socket.id);

  socket.on("disconnect", () => {
    console.log("socket.io: User disconnected: ", socket.id);
  });

  socket.on("createRoom", ({projectId, user}) => {
    socket.join(projectId)
  })

  socket.on("joinPokerPlanningRoom", ({ projectId, user }) => {
    socket.join(projectId);

    if (!rooms.find((room) => room.id === projectId)) {
      rooms.push({ id: projectId, users: [user], task: null });
    } else {
      if (
        !rooms
          .find((room) => room.id === projectId)
          .users.find((u) => u._id === user._id)
      ) {
        rooms.find((room) => room.id === projectId).users.push(user);
      }
    }

    // en vez d emitir solo el usuario recien logueado, emito toda la room de vuelta con toda su info.
    io.to(projectId).emit(
      "userJoined",
      rooms.find((room) => room.id === projectId)
    );
  });

  socket.on("setTask", ({ projectId, task }) => {
    const room = rooms.find((r) => r.id === projectId);

    if (room) {
      room.task = task;
      io.to(projectId).emit("newTaskSetted", room);
    }
  });

  socket.on("changeButtonsState", ({projectId, value}) => {
    const room = rooms.find((r) => r.id === projectId);

    if(room) {
      room.buttonsEnabled = value;

      io.to(projectId).emit("buttonsStateChanged", room)
    }
  })

  socket.on("totalValue", ({ projectId, valueSet }) => {
    const room = rooms.find((r) => {
      return r.id === projectId;
    });

    if (room) {
      if(isNaN(valueSet)) valueSet = "0";

      room.totalValue = valueSet;

      io.to(projectId).emit("totalValueSent", room);
    }
  });

  socket.on("changeUserValue", ({ value, projectId, user }) => {
    const room = rooms.find((r) => r.id === projectId);
    room.users.find((u) => u._id === user._id).settedValue = value;

    io.to(projectId).emit("valueChanged", room);
  });

  socket.on("taskUpdatedSuccess", ({projectId}) => {
    const room = rooms.find((r) => r.id === projectId);

    if(room) {
      room.task = null;
      room.buttonsEnabled = false;
      room.task = null
      room.totalValue = null

      room.users.forEach(u => u.settedValue = null)

      io.to(projectId).emit("resetGame", room)
    }
  })

  socket.on("disconnectUser", ({projectId, user}) => {
    const room = rooms.find((r) => r.id === projectId);

    if(room) {
      room.users = room.users.filter(u => u._id !== user._id)
      io.to(projectId).emit("userDisconnected", room)
    }
  })

  socket.on("closeRoom", ({projectId}) => {
    // borro la room
    rooms = rooms.filter(r => r.id !== projectId)

    console.log(rooms)

    io.to(projectId).emit("roomClosed")
  })
});

// const io = require("socket.io")(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

// io.of("/api/socket").on("connection", (socket) => {
//   console.log("socket.io: User connected: ", socket.id);

//   socket.on("disconnect", () => {
//     console.log("socket.io: User disconnected: ", socket.id);
//   });
// });

// function connect(server) {
//   socket.io = socketIO(server, {
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST"],
//     },
//   });
// }

module.exports = io;
// module.exports = {
//   connect,
//   socket,
// };

/**
 * 1. modularizar methods de rooms
 * 2. tab de config -> modificar values de poker planning
 * 3. filtros (fede)
 * 4. protejer ruta (redirect si no hay estado de Redux);
 * 5. mostrar votos, calcular promedios, aceptar el promedio como SP y reiniciar votacion
 * 6. animaciones (??)
 */
