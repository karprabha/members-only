import { Schema, model } from "mongoose";
import { DateTime } from "luxon";

const MessageSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, minLength: 1, maxLength: 255 },
    message: { type: String, required: true, minLength: 1, maxLength: 2000 },
    added: { type: Date, default: Date.now },
});

MessageSchema.virtual("added_formatted").get(function () {
    return DateTime.fromJSDate(this.added).toLocaleString(DateTime.DATE_MED);
});

const Message = model("Message", MessageSchema);

export default Message;
