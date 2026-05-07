

const getUserModel = (sequelize, { DataTypes }) => {
  const User = sequelize.define("user", {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    // 1. Adicionado o campo password
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [6, 100], // Garante que a senha tenha um tamanho mínimo antes do hash
      },
    },
  });

  // 2. Adicionado o relacionamento com RefreshToken
  User.associate = (models) => {
    User.hasMany(models.Message, { onDelete: "CASCADE" });
    User.hasMany(models.RefreshToken, { onDelete: "CASCADE" }); 
  };

  User.findByLogin = async (login) => {
    let user = await User.findOne({
      where: { username: login },
    });

    if (!user) {
      user = await User.findOne({
        where: { email: login },
      });
    }

    return user;
  };

  // 3. Método para gerar o Hash
  User.generatePasswordHash = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  };

  // 4. Hooks do Sequelize
  User.beforeCreate(async (user) => {
    user.password = await User.generatePasswordHash(user.password);
  });

  User.beforeUpdate(async (user) => {
    // Garante que o hash só seja refeito se a senha foi alterada
    if (user.changed("password")) {
      user.password = await User.generatePasswordHash(user.password);
    }
  });

  // 5. Método de instância para validar a senha durante o login
  User.prototype.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  return User;
};

export default getUserModel;