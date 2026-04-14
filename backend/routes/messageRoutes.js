// File: backend/routes/messageRoutes.js

const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { protect } = require("../middleware/authMiddleware");

// GET all messages for a specific conversation
router.get("/:conversationId", protect, (req, res) => {
    const { conversationId } = req.params;
    const userId = req.user.id;

    // Authorization check: Ensure user is a participant of this conversation
    const checkParticipantSql = "SELECT * FROM conversation_participants WHERE conversation_id = ? AND user_id = ?";
    db.query(checkParticipantSql, [conversationId, userId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(403).json({ error: "Access denied." });
        }

        // If authorized, fetch messages
        const getMessagesSql = "SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC";
        db.query(getMessagesSql, [conversationId], (messagesErr, messages) => {
            if (messagesErr) return res.status(500).json({ error: "Database error." });
            res.json(messages);
        });
    });
});

// POST a new message to a conversation
router.post("/:conversationId", protect, (req, res) => {
    const { conversationId } = req.params;
    const { message_text } = req.body;
    const sender_id = req.user.id;

    if (!message_text) {
        return res.status(400).json({ error: "Message text is required." });
    }

    // --- AUTHORIZATION & TIME-LIMIT LOGIC ---
    const authSql = `
        SELECT c.expires_at, p.user_id
        FROM conversations c
        JOIN conversation_participants p ON c.id = p.conversation_id
        WHERE c.id = ? AND p.user_id = ?
    `;

    db.query(authSql, [conversationId, sender_id], (err, results) => {
        if (err || results.length === 0) {
            return res.status(403).json({ error: "You are not a member of this conversation." });
        }

        const conversation = results[0];

        // Check if the conversation has expired (for marketplace orders)
        if (conversation.expires_at && new Date(conversation.expires_at) < new Date()) {
            return res.status(403).json({ error: "This chat has expired and is now closed." });
        }

        // --- IF AUTHORIZED, PROCEED TO SEND MESSAGE ---

        // Get the receiver's ID
        const getReceiverSql = "SELECT user_id FROM conversation_participants WHERE conversation_id = ? AND user_id != ?";
        db.query(getReceiverSql, [conversationId, sender_id], (receiverErr, receiverResult) => {
            if (receiverErr || receiverResult.length === 0) {
                return res.status(404).json({ error: "Could not find the other participant." });
            }
            const receiver_id = receiverResult[0].user_id;

            // Insert the message
            const insertMessageSql = "INSERT INTO messages (conversation_id, sender_id, receiver_id, message_text) VALUES (?, ?, ?, ?)";
            const values = [conversationId, sender_id, receiver_id, message_text];

            db.query(insertMessageSql, values, (insertErr, insertResult) => {
                if (insertErr) return res.status(500).json({ error: "Database error sending message." });

                // Emit the message via Socket.io
                const getNewMessageSql = "SELECT * FROM messages WHERE id = ?";
                db.query(getNewMessageSql, [insertResult.insertId], (msgErr, messages) => {
                    if (msgErr || messages.length === 0) return;
                    const newMessage = messages[0];
                    const roomName = `conversation-${conversationId}`;
                    req.io.to(roomName).emit('receive_message', newMessage);
                });
                
                res.status(201).json({ message: "Message sent successfully." });
            });
        });
    });
});


module.exports = router;