// models/report.js
export default (sequelize, DataTypes) => {
    const Report = sequelize.define('Report', {
        id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
        reportedBy: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        reportedUser: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
        reason: { type: DataTypes.TEXT, allowNull: false },
        details: { type: DataTypes.TEXT, allowNull: true },
        resolved: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    }, {
        tableName: 'reports',
        timestamps: true,
    });


    return Report;
};