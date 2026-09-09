import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";

export const initSocket = (httpServer: HTTPServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL,
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket: Socket) => {
        console.log(`[Socket] Connected: ${socket.id}`);

        // Join Signaling Room with 2-user limit check
        socket.on("join-room", ({ roomId }: { roomId: string }) => {
            const room = io.sockets.adapter.rooms.get(roomId);
            const numClients = room ? room.size : 0;

            if (numClients >= 2) {
                socket.emit("room-full", {
                    message: "This transfer room is full. Only 2 users allowed.",
                });
                return;
            }

            socket.join(roomId);
            console.log(`[Socket] ${socket.id} joined room: ${roomId}`);

            // Notify existing peer in the room
            socket.to(roomId).emit("user-joined", { signalUserId: socket.id });
        });

        // Relay WebRTC Offer
        socket.on("offer", ({ roomId, offer }: { roomId: string; offer: any }) => {
            socket.to(roomId).emit("offer", { offer, senderId: socket.id });
        });

        // Relay WebRTC Answer
        socket.on("answer", ({ roomId, answer }: { roomId: string; answer: any }) => {
            socket.to(roomId).emit("answer", { answer, senderId: socket.id });
        });

        // Relay ICE Candidate
        socket.on(
            "ice-candidate",
            ({ roomId, candidate }: { roomId: string; candidate: any }) => {
                socket.to(roomId).emit("ice-candidate", { candidate, senderId: socket.id });
            }
        );

        // Handle Explicit Leave Room Event
        socket.on("leave-room", ({ roomId }: { roomId: string }) => {
            socket.leave(roomId);
            socket.to(roomId).emit("user-left", { signalUserId: socket.id });
            console.log(`[Socket] ${socket.id} left room: ${roomId}`);
        });

        // Handle Disconnection
        socket.on("disconnecting", () => {
            socket.rooms.forEach((roomId) => {
                if (roomId !== socket.id) {
                    socket.to(roomId).emit("user-left", { signalUserId: socket.id });
                }
            });
            console.log(`[Socket] Disconnected: ${socket.id}`);
        });
    });
};