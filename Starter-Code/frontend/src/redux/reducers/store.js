import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/index";
import adminOrdersReducer from "./adminOrders/index"
import orderReducer from "./createOrder/index"; 
import  AdminCategoryReducer from "./adminCategories";
import userCategories from "./userCategory"


const store = configureStore({
  reducer: {
    authReducer: authReducer,
    adminOrdersReducer: adminOrdersReducer,
    adminCategories: AdminCategoryReducer,
    order: orderReducer,
    userCategory:userCategories
    
  },
});

export default store;

