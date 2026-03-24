export type PortalSection =
  | 'catalog'
  | 'apis'
  | 'docs'
  | 'toolbox'
  | 'playlists'
  | 'radar';

export type QuickAction = {
  id: string;
  title: string;
  description: string;
  to: string;
};

export type RecommendationItem = {
  id: string;
  title: string;
  reason: string;
  type: 'service' | 'api' | 'doc' | 'tool';
  owner: string;
  to: string;
};

export type VisitItem = {
  id: string;
  title: string;
  subtitle: string;
  section: PortalSection;
  to: string;
};

export type ServiceItem = {
  id: string;
  name: string;
  owner: string;
  domain: string;
  runtime: string;
  environment: string;
  tags: string[];
};

export type ApiItem = {
  id: string;
  name: string;
  owner: string;
  domain: string;
  lifecycle: 'production' | 'beta' | 'experimental';
  tags: string[];
  summary: string;
};

export type DocItem = {
  id: string;
  title: string;
  owner: string;
  domain: string;
  tags: string[];
  reads: number;
};

export type ToolItem = {
  id: string;
  name: string;
  category: string;
  tags: string[];
  usedCount: number;
  description: string;
};

export type PlaylistItem = {
  id: string;
  role: 'Developer' | 'SRE/Ops' | 'PO/PM' | 'New Joiner';
  title: string;
  items: string[];
  estimateMinutes: number;
};
