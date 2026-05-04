import { v4 as uuidv4 } from 'uuid';

const getRefreshTokenModel = (sequelize, { DataTypes }) => {
  const RefreshToken = sequelize.define("refreshToken", {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  // Relacionamento reverso: Um RefreshToken pertence a um User
  RefreshToken.associate = (models) => {
    RefreshToken.belongsTo(models.User, {
      foreignKey: "userId",
      targetKey: "id",
    });
  };

  // Método auxiliar para criar um token atrelado ao usuário
  RefreshToken.createToken = async function (user) {
    let expiredAt = new Date();
    // Define a validade do refresh token (exemplo: 7 dias)
    expiredAt.setDate(expiredAt.getDate() + 7);

    let _token = uuidv4();

    let refreshToken = await this.create({
      token: _token,
      userId: user.id,
      expiryDate: expiredAt.getTime(),
    });

    return refreshToken.token;
  };

  // Método auxiliar para verificar se o token expirou
  RefreshToken.verifyExpiration = (token) => {
    return token.expiryDate.getTime() < new Date().getTime();
  };

  return RefreshToken;
};

export default getRefreshTokenModel;