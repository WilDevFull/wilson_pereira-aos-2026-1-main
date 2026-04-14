import { Router } from "express";
import * as tarefaController from "../controllers/tarefaController";

const router = Router();

router.post("/", tarefaController.criarTarefa);
router.get("/", tarefaController.listarTarefas);
router.get("/:objectId", tarefaController.obterTarefa);
router.put("/:objectId", tarefaController.atualizarTarefa);
router.delete("/:objectId", tarefaController.removerTarefa);

export default router;