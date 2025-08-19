import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Discount = db.sequelize.define("Discount",     {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            len: [1, 50]                
        }
    },
    percentage: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0,
            max: 100
        }
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: true,
            isAfter: new Date().toISOString()       
        }
    },
},{
        tableName: "discounts",
        timestamps: false,  
    }   
);

export default Discount;