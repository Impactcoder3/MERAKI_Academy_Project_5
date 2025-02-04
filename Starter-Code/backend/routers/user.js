
const express = require("express");

const {
  login,
  register,
  createRequest,
  getRequestsById,
  updateRequestById,
  addRequestByUserId,
  getALLOrdersById,
  getAssignOrderById
} = require("../controllers/user");
const authentication = require("../middleware/authentication");
const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/createRequestByuserId", authentication, createRequest);
userRouter.put("/updateRequestById/:id", authentication, updateRequestById);
userRouter.get("/getRequestByuserId", authentication,getRequestsById);
userRouter.post("/addRequest/:id", addRequestByUserId)
userRouter.get("/getAllOrder/:id",getALLOrdersById)
userRouter.get("/assignOrderById/:id",getAssignOrderById)

module.exports = userRouter;



