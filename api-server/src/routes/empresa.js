const { Router } = require('express');
const {
  listOrganizations,
  findOrganization,
  serializeOrganization,
  createOrganization,
  updateOrganization,
  toggleFavorite,
  listDepartments,
  findDepartment,
  serializeDepartment,
  createDepartment,
  updateDepartment,
  toggleDepartmentFavorite,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  moveProduct,
  listSubmissions,
  getSubmission,
  createSubmission,
  moveSubmission,
  addSubmissionNote,
  assignSubmission,
  listMembers,
  inviteMember,
  updateMember,
  listRoles,
  updateRole,
  listGroups,
  createGroup,
  updateGroup,
  addMembersToGroup,
  listCreators,
  listCreatorGroups,
  createCreatorGroup,
  updateCreatorGroup,
  addCreatorsToGroup,
  listProductsForCreator,
} = require('../data/empresa');
const { success, failure, paginated } = require('../helpers/response');

const router = Router();

// ---------- Organizations ----------

// GET /organizations
router.get('/organizations', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize) || 20));
  const result = listOrganizations({ page, pageSize });
  res.json(success(paginated(result.items, result.page, result.pageSize, result.total)));
});

// GET /organizations/:slug
router.get('/organizations/:slug', (req, res) => {
  const org = findOrganization(req.params.slug);
  if (!org) return res.status(404).json(failure('Organização não encontrada.', 404, 'empresa/org-not-found'));
  res.json(success(serializeOrganization(org)));
});

// POST /organizations
router.post('/organizations', (req, res) => {
  const result = createOrganization(req.body || {});
  if (!result.ok) {
    const map = {
      'missing-fields': ['Informe nome, e-mail corporativo e domínio.', 400],
      'slug-taken': ['Domínio já existe.', 409],
    };
    const [message, status] = map[result.code] || ['Erro desconhecido.', 500];
    return res.status(status).json(failure(message, status, `empresa/${result.code}`));
  }
  res.status(201).json(success(result.organization, 201, 'Organização criada com sucesso.'));
});

// PATCH /organizations/:slug
router.patch('/organizations/:slug', (req, res) => {
  const result = updateOrganization(req.params.slug, req.body || {});
  if (!result.ok) {
    return res.status(404).json(failure('Organização não encontrada.', 404, 'empresa/org-not-found'));
  }
  res.json(success(result.organization));
});

// PATCH /organizations/:slug/favorite
router.patch('/organizations/:slug/favorite', (req, res) => {
  const result = toggleFavorite(req.params.slug);
  if (!result.ok) {
    return res.status(404).json(failure('Organização não encontrada.', 404, 'empresa/org-not-found'));
  }
  res.json(success(result.organization));
});

// ---------- Departments ----------

// GET /organizations/:slug/departments
router.get('/organizations/:slug/departments', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize) || 20));
  const result = listDepartments(req.params.slug, { page, pageSize });
  if (!result) return res.status(404).json(failure('Organização não encontrada.', 404, 'empresa/org-not-found'));
  res.json(success(paginated(result.items, result.page, result.pageSize, result.total, req.query)));
});

// GET /organizations/:slug/departments/:deptSlug
router.get('/organizations/:slug/departments/:deptSlug', (req, res) => {
  const dept = findDepartment(req.params.slug, req.params.deptSlug);
  if (!dept) return res.status(404).json(failure('Departamento não encontrado.', 404, 'empresa/dept-not-found'));
  res.json(success(serializeDepartment(dept)));
});

// POST /organizations/:slug/departments
router.post('/organizations/:slug/departments', (req, res) => {
  const result = createDepartment(req.params.slug, req.body || {});
  if (!result.ok) {
    const map = {
      'org-not-found': ['Organização não encontrada.', 404],
      'missing-fields': ['Informe nome e identificador do departamento.', 400],
      'slug-taken': ['Já existe um departamento com esse identificador.', 409],
    };
    const [message, status] = map[result.code] || ['Erro desconhecido.', 500];
    return res.status(status).json(failure(message, status, `empresa/${result.code}`));
  }
  res.status(201).json(success(result.department, 201, 'Departamento criado com sucesso.'));
});

// PATCH /organizations/:slug/departments/:deptSlug
router.patch('/organizations/:slug/departments/:deptSlug', (req, res) => {
  const result = updateDepartment(req.params.slug, req.params.deptSlug, req.body || {});
  if (!result.ok) return res.status(404).json(failure('Departamento não encontrado.', 404, 'empresa/dept-not-found'));
  res.json(success(result.department));
});

// PATCH /organizations/:slug/departments/:deptSlug/favorite
router.patch('/organizations/:slug/departments/:deptSlug/favorite', (req, res) => {
  const result = toggleDepartmentFavorite(req.params.slug, req.params.deptSlug);
  if (!result.ok) return res.status(404).json(failure('Departamento não encontrado.', 404, 'empresa/dept-not-found'));
  res.json(success(result.department));
});

// ---------- Products ----------

// GET /organizations/:slug/products
router.get('/organizations/:slug/products', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize) || 50));
  const result = listProducts(req.params.slug, {
    type: req.query.type,
    phase: req.query.phase,
    department: req.query.department,
    page,
    pageSize,
  });
  if (!result) return res.status(404).json(failure('Organização não encontrada.', 404, 'empresa/org-not-found'));
  res.json(success(paginated(result.items, result.page, result.pageSize, result.total, req.query)));
});

// GET /organizations/:slug/products/:id
router.get('/organizations/:slug/products/:id', (req, res) => {
  const product = getProduct(req.params.slug, req.params.id);
  if (!product) return res.status(404).json(failure('Produto não encontrado.', 404, 'empresa/product-not-found'));
  res.json(success(product));
});

// POST /organizations/:slug/products
router.post('/organizations/:slug/products', (req, res) => {
  const result = createProduct(req.params.slug, req.body || {});
  if (!result.ok) {
    const map = {
      'org-not-found': ['Organização não encontrada.', 404],
      'invalid-type': ['Tipo de produto inválido.', 400],
      'missing-title': ['Informe o título do produto.', 400],
    };
    const [message, status] = map[result.code] || ['Erro desconhecido.', 500];
    return res.status(status).json(failure(message, status, `empresa/${result.code}`));
  }
  res.status(201).json(success(result.product, 201, 'Produto criado.'));
});

// PATCH /organizations/:slug/products/:id
router.patch('/organizations/:slug/products/:id', (req, res) => {
  const result = updateProduct(req.params.slug, req.params.id, req.body || {});
  if (!result.ok) return res.status(404).json(failure('Produto não encontrado.', 404, 'empresa/product-not-found'));
  res.json(success(result.product));
});

// PATCH /organizations/:slug/products/:id/move
router.patch('/organizations/:slug/products/:id/move', (req, res) => {
  const { phase } = req.body || {};
  const result = moveProduct(req.params.slug, req.params.id, phase);
  if (!result.ok) {
    const map = {
      'not-found': ['Produto não encontrado.', 404],
      'invalid-phase': ['Fase inválida.', 400],
    };
    const [message, status] = map[result.code] || ['Erro desconhecido.', 500];
    return res.status(status).json(failure(message, status, `empresa/${result.code}`));
  }
  res.json(success(result.product));
});

// ---------- Submissions ----------

// GET /organizations/:slug/submissions
router.get('/organizations/:slug/submissions', (req, res) => {
  const result = listSubmissions(req.params.slug, req.query);
  if (!result) return res.status(404).json(failure('Organização não encontrada.', 404, 'empresa/org-not-found'));
  res.json(success(paginated(result.items, result.page, result.pageSize, result.total, req.query)));
});

// GET /organizations/:slug/submissions/:id
router.get('/organizations/:slug/submissions/:id', (req, res) => {
  const submission = getSubmission(req.params.slug, req.params.id);
  if (!submission) return res.status(404).json(failure('Submissão não encontrada.', 404, 'empresa/submission-not-found'));
  res.json(success(submission));
});

// POST /organizations/:slug/products/:id/submissions  → criada pelo público via Saiba Mais
router.post('/organizations/:slug/products/:id/submissions', (req, res) => {
  const result = createSubmission(req.params.slug, req.params.id, req.body || {});
  if (!result.ok) {
    const map = { 'product-not-found': ['Produto não encontrado.', 404] };
    const [message, status] = map[result.code] || ['Erro desconhecido.', 500];
    return res.status(status).json(failure(message, status, `empresa/${result.code}`));
  }
  res.status(201).json(success(result.submission, 201, 'Submissão registrada.'));
});

// PATCH /organizations/:slug/submissions/:id/move
router.patch('/organizations/:slug/submissions/:id/move', (req, res) => {
  const { phase } = req.body || {};
  const result = moveSubmission(req.params.slug, req.params.id, phase);
  if (!result.ok) {
    const map = {
      'not-found': ['Submissão não encontrada.', 404],
      'invalid-phase': ['Fase inválida para o tipo do Produto.', 400],
    };
    const [message, status] = map[result.code] || ['Erro desconhecido.', 500];
    return res.status(status).json(failure(message, status, `empresa/${result.code}`));
  }
  res.json(success(result.submission));
});

// POST /organizations/:slug/submissions/:id/notes
router.post('/organizations/:slug/submissions/:id/notes', (req, res) => {
  const { note } = req.body || {};
  const result = addSubmissionNote(req.params.slug, req.params.id, note || '');
  if (!result.ok) return res.status(404).json(failure('Submissão não encontrada.', 404, 'empresa/submission-not-found'));
  res.json(success(result.submission));
});

// PATCH /organizations/:slug/submissions/:id/assign
router.patch('/organizations/:slug/submissions/:id/assign', (req, res) => {
  const { memberId } = req.body || {};
  const result = assignSubmission(req.params.slug, req.params.id, memberId);
  if (!result.ok) return res.status(404).json(failure('Submissão não encontrada.', 404, 'empresa/submission-not-found'));
  res.json(success(result.submission));
});

// ---------- Members ----------

router.get('/organizations/:slug/members', (req, res) => {
  const result = listMembers(req.params.slug);
  if (!result) return res.status(404).json(failure('Organização não encontrada.', 404, 'empresa/org-not-found'));
  res.json(success(paginated(result.items, result.page, result.pageSize, result.total)));
});

router.post('/organizations/:slug/members/invite', (req, res) => {
  const result = inviteMember(req.params.slug, req.body || {});
  if (!result.ok) {
    const map = {
      'org-not-found': ['Organização não encontrada.', 404],
      'missing-fields': ['Informe e-mail e função.', 400],
      'role-not-found': ['Função não encontrada.', 404],
    };
    const [message, status] = map[result.code] || ['Erro desconhecido.', 500];
    return res.status(status).json(failure(message, status, `empresa/${result.code}`));
  }
  res.status(201).json(success(result.member, 201, 'Convite enviado.'));
});

router.patch('/organizations/:slug/members/:id', (req, res) => {
  const result = updateMember(req.params.slug, req.params.id, req.body || {});
  if (!result.ok) {
    const map = {
      'org-not-found': ['Organização não encontrada.', 404],
      'not-found': ['Membro não encontrado.', 404],
      'role-not-found': ['Função não encontrada.', 404],
    };
    const [message, status] = map[result.code] || ['Erro desconhecido.', 500];
    return res.status(status).json(failure(message, status, `empresa/${result.code}`));
  }
  res.json(success(result.member));
});

// ---------- Roles ----------

router.get('/organizations/:slug/roles', (req, res) => {
  const result = listRoles(req.params.slug);
  if (!result) return res.status(404).json(failure('Organização não encontrada.', 404, 'empresa/org-not-found'));
  res.json(success(result));
});

router.patch('/organizations/:slug/roles/:id', (req, res) => {
  const result = updateRole(req.params.slug, req.params.id, req.body || {});
  if (!result.ok) {
    const map = {
      'org-not-found': ['Organização não encontrada.', 404],
      'not-found': ['Função não encontrada.', 404],
    };
    const [message, status] = map[result.code] || ['Erro desconhecido.', 500];
    return res.status(status).json(failure(message, status, `empresa/${result.code}`));
  }
  res.json(success(result.role));
});

// ---------- Groups ----------

router.get('/organizations/:slug/groups', (req, res) => {
  const result = listGroups(req.params.slug);
  if (!result) return res.status(404).json(failure('Organização não encontrada.', 404, 'empresa/org-not-found'));
  res.json(success(result));
});

router.post('/organizations/:slug/groups', (req, res) => {
  const result = createGroup(req.params.slug, req.body || {});
  if (!result.ok) {
    const map = {
      'org-not-found': ['Organização não encontrada.', 404],
      'missing-name': ['Informe o nome do grupo.', 400],
    };
    const [message, status] = map[result.code] || ['Erro desconhecido.', 500];
    return res.status(status).json(failure(message, status, `empresa/${result.code}`));
  }
  res.status(201).json(success(result.group, 201, 'Grupo criado.'));
});

router.patch('/organizations/:slug/groups/:id', (req, res) => {
  const result = updateGroup(req.params.slug, req.params.id, req.body || {});
  if (!result.ok) {
    const map = {
      'org-not-found': ['Organização não encontrada.', 404],
      'not-found': ['Grupo não encontrado.', 404],
    };
    const [message, status] = map[result.code] || ['Erro desconhecido.', 500];
    return res.status(status).json(failure(message, status, `empresa/${result.code}`));
  }
  res.json(success(result.group));
});

router.post('/organizations/:slug/groups/:id/members', (req, res) => {
  const { memberIds } = req.body || {};
  const result = addMembersToGroup(req.params.slug, req.params.id, memberIds);
  if (!result.ok) {
    const map = {
      'org-not-found': ['Organização não encontrada.', 404],
      'not-found': ['Grupo não encontrado.', 404],
    };
    const [message, status] = map[result.code] || ['Erro desconhecido.', 500];
    return res.status(status).json(failure(message, status, `empresa/${result.code}`));
  }
  res.json(success(result.group));
});

// ---------- Creators ----------

// GET /organizations/:slug/creators
router.get('/organizations/:slug/creators', (req, res) => {
  const result = listCreators(req.params.slug);
  if (!result) return res.status(404).json(failure('Organização não encontrada.', 404, 'empresa/org-not-found'));
  res.json(success(result));
});

// GET /organizations/:slug/creators/:creatorId/products  → produtos liberados ao creator
router.get('/organizations/:slug/creators/:creatorId/products', (req, res) => {
  const result = listProductsForCreator(req.params.slug, req.params.creatorId);
  if (!result) return res.status(404).json(failure('Organização não encontrada.', 404, 'empresa/org-not-found'));
  res.json(success(result));
});

// ---------- Creator Groups ----------

// GET /organizations/:slug/creator-groups
router.get('/organizations/:slug/creator-groups', (req, res) => {
  const result = listCreatorGroups(req.params.slug);
  if (!result) return res.status(404).json(failure('Organização não encontrada.', 404, 'empresa/org-not-found'));
  res.json(success(result));
});

// POST /organizations/:slug/creator-groups
router.post('/organizations/:slug/creator-groups', (req, res) => {
  const result = createCreatorGroup(req.params.slug, req.body || {});
  if (!result.ok) {
    const map = {
      'org-not-found': ['Organização não encontrada.', 404],
      'missing-name': ['Informe o nome do grupo.', 400],
    };
    const [message, status] = map[result.code] || ['Erro desconhecido.', 500];
    return res.status(status).json(failure(message, status, `empresa/${result.code}`));
  }
  res.status(201).json(success(result.group, 201, 'Grupo de creators criado.'));
});

// PATCH /organizations/:slug/creator-groups/:id
router.patch('/organizations/:slug/creator-groups/:id', (req, res) => {
  const result = updateCreatorGroup(req.params.slug, req.params.id, req.body || {});
  if (!result.ok) {
    const map = {
      'org-not-found': ['Organização não encontrada.', 404],
      'not-found': ['Grupo não encontrado.', 404],
    };
    const [message, status] = map[result.code] || ['Erro desconhecido.', 500];
    return res.status(status).json(failure(message, status, `empresa/${result.code}`));
  }
  res.json(success(result.group));
});

// POST /organizations/:slug/creator-groups/:id/creators
router.post('/organizations/:slug/creator-groups/:id/creators', (req, res) => {
  const { creatorIds } = req.body || {};
  const result = addCreatorsToGroup(req.params.slug, req.params.id, creatorIds);
  if (!result.ok) {
    const map = {
      'org-not-found': ['Organização não encontrada.', 404],
      'not-found': ['Grupo não encontrado.', 404],
    };
    const [message, status] = map[result.code] || ['Erro desconhecido.', 500];
    return res.status(status).json(failure(message, status, `empresa/${result.code}`));
  }
  res.json(success(result.group));
});

module.exports = router;
