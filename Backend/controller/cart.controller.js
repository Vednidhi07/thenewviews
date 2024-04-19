import Cart from "../model/cart.model.js";
export const addtocart = async(req, res) => {
    try {
        const { name, email, phone } = req.body;
        const file = req.file ? req.file.path : "";
        // const createdCart = new Cart({
        //     name: name,
        //     email: email,
        //     phone: phone,
        //     file: file,
        // });
        const createdCart = new Cart({ name, email, phone, file });

        await createdCart.save();
        res.status(201).json({
            message: "Data saved successfully",
            cart: {
                _id: createdCart._id,
                name: createdCart.name,
                email: createdCart.email,
                phone: createdCart.phone,
                file: createdCart.file,
            },
        });
    } catch (error) {
        console.log("Error: " + error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};