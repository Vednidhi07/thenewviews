import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    file: {
        type: String,
        required: true,
    },
});
const Cart = mongoose.model("Cart", cartSchema);
export default Cart;