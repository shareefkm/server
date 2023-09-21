import jwt from "jsonwebtoken";

export const auth = {
  genrateToken: (id) => {
    const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return token;
  },
  
  verifyToken: async (req, res, next) => {
    let token = req.headers.authorization;
    try {
      if (!token || !token.startsWith("Bearer "))
        return res
          .status(404)
          .json({ message: "Authentication failed: Please Login..." });
      token = token.split(" ")[1];
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { userId: verified.id };
      next();
    } catch (error) {
      console.log(error);
      return res
        .status(404)
        .json({ message: "Authentication failed: invalid Login..." });
    }
  },

  adminVerify: async (req, res, next) => {
    let token = await req.headers.authorization;
    try {
      if (!token || !token.startsWith("Bearer "))
        return res
          .status(404)
          .json({ message: "Authentication failed: Please Login..." });

      token = token.split(" ")[1];

      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = { adminId: verified.id };
      next();
    } catch (error) {
      console.log(error);
      return res
        .status(404)
        .json({ message: "Authentication failed: invalid Login..." });
    }
  },

  restaurantVerify: async (req, res, next) => {
    let token = await req.headers.authorization;
    try {
      if (!token || !token.startsWith("Bearer "))
        return res
          .status(404)
          .json({ message: "Authentication failed: Please Login..." });

      token = token.split(" ")[1];

      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.restaurant = { restaurantId: verified.id };
      next();
    } catch (error) {
      console.log(error);
      return res
        .status(404)
        .json({ message: "Authentication failed: invalid Login..." });
    }
  },
};
