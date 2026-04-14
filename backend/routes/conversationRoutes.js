// File: backend/routes/conversationRoutes.js

const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { protect } = require("../middleware/authMiddleware");

// Find a conversation by its proposal_id
router.get("/by-proposal/:proposalId", protect, (req, res) => {
    const { proposalId } = req.params;
    const userId = req.user.id;

    // First, ensure the user is part of this proposal's conversation
    const sql = `
        SELECT c.id FROM conversations c
        JOIN conversation_participants cp ON c.id = cp.conversation_id
        WHERE c.proposal_id = ? AND cp.user_id = ?
    `;
    db.query(sql, [proposalId, userId], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (results.length === 0) return res.status(404).json({ error: "Conversation not found or access denied." });
        res.json({ conversationId: results[0].id });
    });
});

// Find a conversation by its order_id
router.get("/by-order/:orderId", protect, (req, res) => {
    const { orderId } = req.params;
    const userId = req.user.id;

    const sql = `
        SELECT c.id FROM conversations c
        JOIN conversation_participants cp ON c.id = cp.conversation_id
        WHERE c.order_id = ? AND cp.user_id = ?
    `;
    db.query(sql, [orderId, userId], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (results.length === 0) return res.status(404).json({ error: "Conversation not found or access denied." });
        res.json({ conversationId: results[0].id });
    });
});

module.exports = router;