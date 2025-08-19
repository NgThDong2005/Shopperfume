import { DataTypes } from "sequelize";  
import db from "../config/database.js";
import Product from "./product.model.js";
import User from "./user.model.js";

const Review = db.sequelize.define(
  "Review",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    product_id: {       
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "products",
            key: "id"
        }
    },  
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id"
      }
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comment: {      
        type: DataTypes.TEXT,
        allowNull: true
    },      
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: "reviews",
    timestamps: false
  }
);  

Review.belongsTo(Product, { foreignKey: "product_id", as: "product" });
Review.belongsTo(User, { foreignKey: "user_id", as: "user" });
Product.hasMany(Review, { foreignKey: "product_id", as: "reviews" });
User.hasMany(Review, { foreignKey: "user_id", as: "reviews" }); 

export default Review;