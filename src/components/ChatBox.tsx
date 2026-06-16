"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { formatDate } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  sender: { id: string; name: string };
}

interface ChatBoxProps {
  conversationId: string;
  currentUserId: string;
  receiverId: string;
  receiverName: string;
}

export default function ChatBox({
  conversationId,
  currentUserId,
  receiverId,
  receiverName,
}: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch(`/api/messages?conversationId=${conversationId}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [conversationId]);

  useEffect(() => {
    const socketInstance = io({
      path: "/api/socketio",
    });

    socketInstance.on("connect", () => {
      setConnected(true);
      socketInstance.emit("join-conversation", conversationId);
    });

    socketInstance.on("disconnect", () => {
      setConnected(false);
    });

    socketInstance.on("new-message", (message: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.emit("leave-conversation", conversationId);
      socketInstance.disconnect();
    };
  }, [conversationId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || sending) return;

    setSending(true);
    socket.emit("send-message", {
      conversationId,
      senderId: currentUserId,
      receiverId,
      content: newMessage.trim(),
    });
    setNewMessage("");
    setSending(false);
  };

  return (
    <div className="card flex h-[420px] flex-col">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div>
          <h3 className="font-semibold text-gray-900">Chat: {receiverName}</h3>
          <p className="text-xs text-gray-500">
            {connected ? (
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Onlayn — real vaqtda
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-yellow-500" />
                Ulanmoqda...
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="chat-messages flex-1 space-y-3 overflow-y-auto p-4">
        {loading ? (
          <p className="text-center text-sm text-gray-500">Xabarlar yuklanmoqda...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-sm text-gray-500">
            Hali xabarlar yo&apos;q. Birinchi xabarni yuboring!
          </p>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    isOwn
                      ? "rounded-br-sm bg-brand-600 text-white"
                      : "rounded-bl-sm bg-gray-100 text-gray-900"
                  }`}
                >
                  {!isOwn && (
                    <p className="mb-0.5 text-xs font-medium opacity-70">
                      {msg.sender.name}
                    </p>
                  )}
                  <p className="text-sm">{msg.content}</p>
                  <p
                    className={`mt-1 text-[10px] ${
                      isOwn ? "text-brand-100" : "text-gray-400"
                    }`}
                  >
                    {formatDate(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSend} className="border-t border-gray-100 p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Xabaringizni yozing..."
            className="input-field flex-1"
            maxLength={1000}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !connected}
            className="btn-primary shrink-0"
          >
            Yuborish
          </button>
        </div>
      </form>
    </div>
  );
}
