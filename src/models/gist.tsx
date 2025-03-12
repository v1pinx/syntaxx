import { Languages } from "lucide-react";
import mongoose from "mongoose";

const gistSchema = new mongoose.Schema({

    username: { type: String, required: true },
    language: { type: String, required: true },
    code: { type: String, required: true },

});

const Gist = mongoose.models.Gist || mongoose.model("Gist", gistSchema);
export default Gist;