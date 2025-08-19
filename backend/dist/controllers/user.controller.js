"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = me;
const User_1 = require("../models/User");
async function me(req, res) {
    const user = await User_1.User.findById(req.user.id).select("_id email name role createdAt");
    if (!user)
        return res.status(404).json({ message: "User not found" });
    return res.json({ id: user.id, email: user.email, name: user.name, role: user.role, createdAt: user.createdAt });
}
//# sourceMappingURL=user.controller.js.map