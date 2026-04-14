import * as tarefaService from "../services/tarefaService";

export const criarTarefa = async (req, res) => {
  try {
    const novaTarefa = await tarefaService.criarTarefa(req.context.models, req.body);
    res.status(201).send(novaTarefa);
  } catch (error) {
    res.status(400).send({ erro: error.message });
  }
};

export const listarTarefas = async (req, res) => {
  try {
    const tarefas = await tarefaService.listarTarefas(req.context.models);
    res.status(200).send(tarefas);
  } catch (error) {
    res.status(500).send({ erro: "Erro ao listar tarefas" });
  }
};

export const obterTarefa = async (req, res) => {
  try {
    const tarefa = await tarefaService.obterTarefa(req.context.models, req.params.objectId);
    if (!tarefa) {
      return res.status(404).send({ erro: "Tarefa não encontrada" });
    }
    res.status(200).send(tarefa);
  } catch (error) {
    res.status(500).send({ erro: "Erro ao obter tarefa" });
  }
};

export const atualizarTarefa = async (req, res) => {
  try {
    const tarefaAtualizada = await tarefaService.atualizarTarefa(
      req.context.models,
      req.params.objectId,
      req.body
    );
    if (!tarefaAtualizada) {
      return res.status(404).send({ erro: "Tarefa não encontrada" });
    }
    res.status(200).send(tarefaAtualizada);
  } catch (error) {
    res.status(500).send({ erro: "Erro ao atualizar tarefa" });
  }
};

export const removerTarefa = async (req, res) => {
  try {
    const sucesso = await tarefaService.removerTarefa(req.context.models, req.params.objectId);
    if (!sucesso) {
      return res.status(404).send({ erro: "Tarefa não encontrada" });
    }
    res.status(200).send({ mensagem: "Tarefa removida com sucesso" });
  } catch (error) {
    res.status(500).send({ erro: "Erro ao remover tarefa" });
  }
};