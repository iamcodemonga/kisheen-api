import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

export const app = express();
export const server = createServer(app);
export const io =  new Server(server, {
    cors: {
        origin: [ 'http://localhost:3000', 'https://kisheen.vercel.app', 'https://kisheen.com' ],
        credentials: true
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

io.on("connection", (socket) => {
    console.log(socket.id)
    // socket.on("send order", (order) => {
    //     console.log(order);
    //     io.emit("get order", order)
    // })
    socket.on("disconnect", () => {
        console.log("user disconnected");
    })
})