export interface PermissionMeta {
  readonly action: string;
  readonly label: string;
  readonly group: string;
}

export const PERMISSION_CATALOG: readonly PermissionMeta[] = [
  // Produtos
  { action: 'createProduct', label: 'Criar Produto', group: 'Produtos' },
  { action: 'editProduct', label: 'Editar Produto', group: 'Produtos' },
  { action: 'moveProductPhase', label: 'Mover Produto entre fases', group: 'Produtos' },
  { action: 'closeProduct', label: 'Encerrar Produto', group: 'Produtos' },
  { action: 'deleteProduct', label: 'Excluir Produto', group: 'Produtos' },
  { action: 'editKanbanPhases', label: 'Criar/editar fases do Kanban', group: 'Produtos' },

  // Triagens
  { action: 'viewSubmissions', label: 'Visualizar Triagens', group: 'Triagens' },
  { action: 'moveSubmissionPhase', label: 'Mover Triagem entre fases', group: 'Triagens' },

  // Pessoas & permissões
  { action: 'accessPeopleTab', label: 'Acessar aba Pessoas', group: 'Equipe' },
  { action: 'manageUsers', label: 'Convidar/gerenciar usuários', group: 'Equipe' },

  // Organização
  { action: 'editOrganization', label: 'Editar configurações da empresa', group: 'Organização' },

  // Outros
  { action: 'launchSponsoredCampaign', label: 'Lançar Campanha Patrocinada', group: 'Outros' },
  { action: 'viewMetrics', label: 'Ver Métricas', group: 'Outros' },
];

export const PERMISSION_GROUPS: readonly string[] = [
  'Produtos',
  'Triagens',
  'Equipe',
  'Organização',
  'Outros',
];

export function permissionsByGroup(
  permissions: ReadonlyArray<{ action: string; allowed: boolean }>,
): ReadonlyMap<string, Array<{ meta: PermissionMeta; allowed: boolean }>> {
  const allowedMap = new Map<string, boolean>(permissions.map((p) => [p.action, p.allowed]));
  const result = new Map<string, Array<{ meta: PermissionMeta; allowed: boolean }>>();
  for (const group of PERMISSION_GROUPS) result.set(group, []);
  for (const meta of PERMISSION_CATALOG) {
    const allowed = allowedMap.get(meta.action) ?? false;
    result.get(meta.group)!.push({ meta, allowed });
  }
  return result;
}
