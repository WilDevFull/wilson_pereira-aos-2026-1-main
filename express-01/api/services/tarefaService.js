export const criarTarefa = async (models, dados) => {
  if (!dados.descricao) {
    throw new Error("A descrição é obrigatória.");
  }
  return await models.Tarefa.create({
    descricao: dados.descricao,
    concluida: dados.concluida !== undefined ? dados.concluida : false,
  });
};

export const listarTarefas = async (models) => {
  return await models.Tarefa.findAll();
};

export const obterTarefa = async (models, objectId) => {
  return await models.Tarefa.findByPk(objectId);
};

export const atualizarTarefa = async (models, objectId, dados) => {
  const tarefa = await models.Tarefa.findByPk(objectId);
  if (!tarefa) return null;

  return await tarefa.update(dados);
};

export const removerTarefa = async (models, objectId) => {
  const deletados = await models.Tarefa.destroy({
    where: { objectId },
  });
  return deletados > 0;
};