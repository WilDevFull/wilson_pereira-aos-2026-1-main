import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  const users = await req.context.models.User.findAll();
  return res.send(users);
});

router.get("/:userId", async (req, res) => {
  const user = await req.context.models.User.findByPk(req.params.userId);
  return res.send(user);
});

// Password adicionado — obrigatório pelo modelo User
router.post("/", async (req, res) => {
  try {
    const user = await req.context.models.User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    return res.status(201).send(user);
  } catch (error) {
    return res.status(400).send({ erro: error.message });
  }
});

router.put("/:userId", async (req, res) => {
  const user = await req.context.models.User.findByPk(req.params.userId);
  if (user) {
    await user.update({
      username: req.body.username,
      email: req.body.email,
    });
  }
  return res.send(user);
});

router.delete("/:userId", async (req, res) => {
  const result = await req.context.models.User.destroy({
    where: { id: req.params.userId },
  });
  return res.send(true);
});

export default router;