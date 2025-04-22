// Ticket model

import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  qrcode: {
    type: String,
    required: true
  },
}, {
  timestamps: true
});

const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);

export default Ticket;
