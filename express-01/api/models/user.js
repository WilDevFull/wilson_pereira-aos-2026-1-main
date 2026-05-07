import argon2 from 'argon2';

const getUserModel = (sequelize, { DataTypes }) => {
  const User = sequelize.define("user", {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { notEmpty: true },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { notEmpty: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [6, 100],
      },
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Message, { onDelete: "CASCADE" });
    User.hasMany(models.RefreshToken, { onDelete: "CASCADE" });
  };

  User.findByLogin = async (login) => {
    let user = await User.findOne({ where: { username: login } });
    if (!user) {
      user = await User.findOne({ where: { email: login } });
    }
    return user;
  };

  User.generatePasswordHash = async (password) => {
    return await argon2.hash(password);
  };

  User.beforeCreate(async (user) => {
    user.password = await User.generatePasswordHash(user.password);
  });

  User.beforeUpdate(async (user) => {
    if (user.changed("password")) {
      user.password = await User.generatePasswordHash(user.password);
    }
  });

  User.prototype.validatePassword = async function (password) {
    return await argon2.verify(this.password, password);
  };

  return User;
};

export default getUserModel;