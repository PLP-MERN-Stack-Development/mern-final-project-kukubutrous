import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, User, Loader2 } from "lucide-react";
import api from "../utils/api";

const Inbox = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchInbox() {
            try {
                const response = await api.get("/messages/inbox");
                setMessages(response.data);
            } catch (error) {
                console.error("Failed to load inbox:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchInbox();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
            <div className="max-w-3xl mx-auto py-10 px-5">
                <div className="flex items-center gap-3 mb-8">
                    <Mail className="w-8 h-8 text-green-600 dark:text-emerald-400" />
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                        Inbox
                    </h1>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
                    </div>
                ) : messages.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-gray-600 dark:text-gray-300"
                    >
                        <MessageSquare className="w-10 h-10 mx-auto mb-3 text-green-500" />
                        <p>No messages found in your inbox.</p>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((msg, index) => (
                            <motion.div
                                key={msg.id || index}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-md border border-green-200 dark:border-gray-700 shadow-md rounded-2xl p-4 hover:shadow-lg hover:border-green-400 transition-all duration-300"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <User className="text-green-600 dark:text-emerald-400" size={18} />
                                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                                            {msg.senderName || "Unknown Sender"}
                                        </h3>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(msg.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <p className="text-gray-700 dark:text-gray-200">{msg.content}</p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inbox;
*




/*
import React from "react";

export default function Inbox() {
    return (
        <div className="card">
            <h2 className="text-xl font-semibold mb-3">Inbox</h2>
            <p className="text-sm text-gray-600">All your notifications will appear here.</p>
        </div>
    );
}

*/