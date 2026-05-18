import jwt from "jsonwebtoken";

/**
 * Cria o Access Token (JWT).
 *
 * O que é um JWT?
 * É um token com 3 partes separadas por ponto: header.payload.signature
 * - O payload carrega dados do usuário (id, username).
 * - A assinatura garante que ninguém alterou o conteúdo.
 * - Expira rápido (padrão: 15 minutos) — por isso existe o refresh token.
 *
 * @param {object} user - O objeto do usuário vindo do banco de dados.
 * @returns {string} O token JWT assinado.
 */
export const generateAccessToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });
};

/**
 * Cria o Refresh Token (opaque) e salva no banco de dados.
 *
 * O que é um token opaque?
 * É apenas um UUID aleatório (ex: "550e8400-e29b-41d4-a716-446655440000").
 * Ao contrário do JWT, ele não carrega informação — é só uma "chave".
 * Para validá-lo, você precisa consultar o banco de dados.
 * Expira em 7 dias (definido no modelo RefreshToken).
 *
 * @param {object} user   - O objeto do usuário vindo do banco de dados.
 * @param {object} models - O objeto com todos os modelos do Sequelize.
 * @returns {Promise<string>} O UUID do refresh token salvo no banco.
 */
export const generateRefreshToken = async (user, models) => {
  return await models.RefreshToken.createToken(user);
};