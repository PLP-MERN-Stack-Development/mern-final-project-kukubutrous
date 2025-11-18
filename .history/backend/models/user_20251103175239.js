// models/user.js
'use strict';

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
	budgetMin: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
	budgetMax: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
	hobbies: {
	  type: DataTypes.JSON,
	  allowNull: true,
	  get() {
		const raw = this.getDataValue('hobbies');
		return raw || [];
	  },
	},
	preferences: { type: DataTypes.TEXT, allowNull: true },
	gender: { type: DataTypes.ENUM('male', 'female', 'other', 'prefer_not_to_say'), allowNull: true },
	preferredGender: { type: DataTypes.ENUM('male', 'female', 'any', 'other'), allowNull: true, defaultValue: 'any' },

	// ensure password field exists (was referenced later)
	password: { type: DataTypes.STRING, allowNull: true },

	role: { type: DataTypes.ENUM('user', 'admin', 'superAdmin'), allowNull: false, defaultValue: 'user' },
	isHiddenFromUsers: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  }, {
	tableName: 'users',
	timestamps: true,
	defaultScope: { attributes: { exclude: ['password'] } },
	scopes: { withPassword: { attributes: {} } },
	hooks: {
	  beforeCreate: async (user) => {
		if (user.password) {
		  const salt = await bcrypt.genSalt(10);
		  user.password = await bcrypt.hash(user.password, salt);
		}
	  },
	  beforeUpdate: async (user) => {
		if (user.changed && user.changed('password')) {
		  const salt = await bcrypt.genSalt(10);
		  user.password = await bcrypt.hash(user.password, salt);
		}
	  }
	}
  });

  User.prototype.validPassword = async function(candidatePassword) {
	if (!this.password) return false;
	return bcrypt.compare(candidatePassword, this.password);
  };

  User.prototype.toSafeJSON = function() {
	const values = Object.assign({}, this.get());
	delete values.password;
	return values;
  };

  return User;
};