import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server as SocketIOServer } from "socket.io";
import prisma from "./src/lib/prisma";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new SocketIOServer(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
    path: "/api/socketio",
  });

  io.on("connection", (socket) => {
    socket.on("join-conversation", (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on("leave-conversation", (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on(
      "send-message",
      async (data: {
        conversationId: string;
        senderId: string;
        receiverId: string;
        content: string;
      }) => {
        if (!data.content?.trim()) return;

        try {
          const message = await prisma.message.create({
            data: {
              conversationId: data.conversationId,
              senderId: data.senderId,
              receiverId: data.receiverId,
              content: data.content.trim(),
            },
            include: {
              sender: { select: { id: true, name: true } },
            },
          });

          io.to(`conversation:${data.conversationId}`).emit("new-message", message);
        } catch (error) {
          console.error("Xabar yuborishda xatolik:", error);
          socket.emit("message-error", { error: "Xabar yuborib bo'lmadi" });
        }
      }
    );
  });

  httpServer.listen(port, () => {
    console.log(`Mahalliy Bozor ishga tushdi: http://${hostname}:${port}`);
  });
});
