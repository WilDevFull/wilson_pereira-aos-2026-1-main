import { Router } from "express";
import { generateAccessToken, generateRefreshToken } from "../utils/tokenUtils";

const router = Router();

/**
 * GET /session
 * Retorna os dados do usuário logado na sessão atual.
 * (Rota existente — não alterada)
 */
router.get("/", async (req, res) => {
  const user = await req.context.models.User.findByPk(req.context.me.id);
  return res.send(user);
});

/**
 * POST /session
 * Realiza o login de um usuário.
 *
 * Fluxo passo a passo:
 * 1. Recebe { login, password } no corpo da requisição.
 *    - "login" pode ser o username OU o e-mail do usuário.
 * 2. Busca o usuário no banco pelo username ou e-mail.
 * 3. Se não encontrar → responde 404 (não encontrado).
 * 4. Valida a senha usando argon2 (via método do modelo User).
 * 5. Se a senha estiver errada → responde 401 (não autorizado).
 * 6. Gera o Access Token (JWT, curta duração).
 * 7. Gera o Refresh Token (opaque, salvo no banco, longa duração).
 * 8. Retorna os dois tokens para o cliente.
 *
 * Corpo esperado:
 * {
 *   "login": "rwieruch"  ou  "rwieruch@email.com",
 *   "password": "minhasenha123"
 * }
 *
 * Resposta de sucesso (200):
 * {
 *   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
 * }
 */
router.post("/", async (req, res) => {
  try {
    const { login, password } = req.body;

    // --- Passo 1: Verificar se os campos foram enviados ---
    if (!login || !password) {
      return res.status(400).send({
        erro: "Os campos 'login' e 'password' são obrigatórios.",
      });
    }

    // --- Passo 2: Buscar o usuário pelo username ou e-mail ---
    // O método findByLogin já tenta primeiro pelo username,
    // depois pelo e-mail — está definido no modelo User.
    const user = await req.context.models.User.findByLogin(login);

    // --- Passo 3: Usuário não existe ---
    if (!user) {
      return res.status(404).send({
        erro: "Usuário não encontrado.",
      });
    }

    // --- Passo 4: Validar a senha com argon2 ---
    // validatePassword é um método de instância do modelo User.
    // Ele usa argon2.verify() internamente para comparar
    // a senha digitada com o hash armazenado no banco.
    const senhaCorreta = await user.validatePassword(password);

    // --- Passo 5: Senha incorreta ---
    if (!senhaCorreta) {
      return res.status(401).send({
        erro: "Senha incorreta.",
      });
    }

    // --- Passo 6: Gerar o Access Token (JWT) ---
    // Curta duração (padrão: 15 minutos).
    // Carrega id, username e email no payload.
    const accessToken = generateAccessToken(user);

    // --- Passo 7: Gerar o Refresh Token (opaque) ---
    // UUID salvo no banco com validade de 7 dias.
    // Usado futuramente na rota POST /session/refresh
    // para obter um novo accessToken sem precisar fazer login novamente.
    const refreshToken = await generateRefreshToken(
      user,
      req.context.models
    );

    // --- Passo 8: Retornar os dois tokens ---
    return res.status(200).send({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).send({
      erro: "Erro interno ao realizar o login.",
    });
  }
});

export default router;