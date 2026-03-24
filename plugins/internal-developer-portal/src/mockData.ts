import {
  ApiItem,
  DocItem,
  PlaylistItem,
  QuickAction,
  RecommendationItem,
  ServiceItem,
  ToolItem,
  VisitItem,
} from './types';

export const quickActions: QuickAction[] = [
  {
    id: 'find-service',
    title: 'Find a service',
    description: 'Search the catalog by team, domain, or runtime.',
    to: '/start/catalog',
  },
  {
    id: 'request-access',
    title: 'Request access / permissions',
    description: 'Open access workflows and common permission paths.',
    to: '/start/toolbox',
  },
  {
    id: 'create-template',
    title: 'Create from template',
    description: 'Start a new service from approved scaffolder templates.',
    to: '/create',
  },
  {
    id: 'ownership',
    title: 'View ownership / on-call',
    description: 'See who owns what and current support responsibilities.',
    to: '/start/catalog',
  },
  {
    id: 'tech-radar',
    title: 'Explore tech standards (Tech Radar)',
    description: 'Review adopt/trial/assess/hold guidance.',
    to: '/start/radar',
  },
];

export const recommendations: RecommendationItem[] = [
  {
    id: 'rec-1',
    title: 'payments-api',
    reason: 'Owned by your team and recently updated',
    type: 'api',
    owner: 'team-payments',
    to: '/start/apis',
  },
  {
    id: 'rec-2',
    title: 'Checkout Runbook',
    reason: 'Frequently used during your on-call window',
    type: 'doc',
    owner: 'team-checkout',
    to: '/start/docs',
  },
  {
    id: 'rec-3',
    title: 'Incident Toolkit',
    reason: 'Starred by you and used by related squads',
    type: 'tool',
    owner: 'platform-tools',
    to: '/start/toolbox',
  },
];

export const recentItems: VisitItem[] = [
  {
    id: 'recent-1',
    title: 'orders-service',
    subtitle: 'Service entity',
    section: 'catalog',
    to: '/start/catalog',
  },
  {
    id: 'recent-2',
    title: 'Core API Standards',
    subtitle: 'Tech doc',
    section: 'docs',
    to: '/start/docs',
  },
  {
    id: 'recent-3',
    title: 'API Gateway Tool',
    subtitle: 'Utility tool',
    section: 'toolbox',
    to: '/start/toolbox',
  },
];

export const pinnedItems: VisitItem[] = [
  {
    id: 'pinned-1',
    title: 'service-template-node',
    subtitle: 'Scaffolder template',
    section: 'catalog',
    to: '/create',
  },
  {
    id: 'pinned-2',
    title: 'SRE onboarding playlist',
    subtitle: 'Role playlist',
    section: 'playlists',
    to: '/start/playlists',
  },
];

export const services: ServiceItem[] = [
  {
    id: 'svc-1',
    name: 'orders-service',
    owner: 'team-commerce',
    domain: 'commerce',
    runtime: 'Node.js',
    environment: 'prod',
    tags: ['critical', 'tier-1'],
  },
  {
    id: 'svc-2',
    name: 'inventory-worker',
    owner: 'team-supply',
    domain: 'supply',
    runtime: 'Python',
    environment: 'staging',
    tags: ['batch'],
  },
  {
    id: 'svc-3',
    name: 'account-service',
    owner: 'team-identity',
    domain: 'platform',
    runtime: 'Java',
    environment: 'prod',
    tags: ['pii'],
  },
];

export const apis: ApiItem[] = [
  {
    id: 'api-1',
    name: 'Payments API',
    owner: 'team-payments',
    domain: 'commerce',
    lifecycle: 'production',
    tags: ['rest', 'external'],
    summary: 'Handles payment authorization and capture.',
  },
  {
    id: 'api-2',
    name: 'Identity API',
    owner: 'team-identity',
    domain: 'platform',
    lifecycle: 'beta',
    tags: ['graphql', 'internal'],
    summary: 'User profile and access scope management.',
  },
  {
    id: 'api-3',
    name: 'Pricing API',
    owner: 'team-commerce',
    domain: 'commerce',
    lifecycle: 'experimental',
    tags: ['rest', 'internal'],
    summary: 'Price simulation for promo scenarios.',
  },
];

export const docs: DocItem[] = [
  {
    id: 'doc-1',
    title: 'Production Readiness Checklist',
    owner: 'platform-enablement',
    domain: 'platform',
    tags: ['runbook', 'best-practice'],
    reads: 489,
  },
  {
    id: 'doc-2',
    title: 'API Versioning Guidelines',
    owner: 'architecture-board',
    domain: 'standards',
    tags: ['api', 'governance'],
    reads: 332,
  },
  {
    id: 'doc-3',
    title: 'On-call Handoff Playbook',
    owner: 'sre-core',
    domain: 'operations',
    tags: ['on-call', 'incident'],
    reads: 412,
  },
];

export const tools: ToolItem[] = [
  {
    id: 'tool-1',
    name: 'Access Request Wizard',
    category: 'Access',
    tags: ['permissions', 'iam'],
    usedCount: 1224,
    description: 'Guided flow for requesting repository and cloud access.',
  },
  {
    id: 'tool-2',
    name: 'Incident Timeline Builder',
    category: 'Operations',
    tags: ['incident', 'postmortem'],
    usedCount: 870,
    description: 'Creates synchronized event timelines from logs and alerts.',
  },
  {
    id: 'tool-3',
    name: 'Service Dependency Mapper',
    category: 'Architecture',
    tags: ['graph', 'service-map'],
    usedCount: 640,
    description: 'Visualizes service-to-service dependencies by environment.',
  },
];

export const playlists: PlaylistItem[] = [
  {
    id: 'pl-1',
    role: 'Developer',
    title: 'Ship a new service safely',
    items: ['Read service template guide', 'Create service', 'Set up docs + alerts'],
    estimateMinutes: 45,
  },
  {
    id: 'pl-2',
    role: 'SRE/Ops',
    title: 'Operate production confidently',
    items: ['Review on-call runbooks', 'Check dashboard standards', 'Run incident drill'],
    estimateMinutes: 60,
  },
  {
    id: 'pl-3',
    role: 'PO/PM',
    title: 'Understand delivery health',
    items: ['Open roadmap docs', 'Browse API dependencies', 'Track ownership map'],
    estimateMinutes: 30,
  },
  {
    id: 'pl-4',
    role: 'New Joiner',
    title: 'First week onboarding',
    items: ['Portal basics', 'Ownership model', 'Request access'],
    estimateMinutes: 35,
  },
];
