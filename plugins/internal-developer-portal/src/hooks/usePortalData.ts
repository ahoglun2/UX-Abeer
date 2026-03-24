import { useApi, identityApiRef } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { useEffect, useMemo, useState } from 'react';
import {
  apis as fallbackApis,
  docs as fallbackDocs,
  pinnedItems as fallbackPinned,
  playlists,
  quickActions,
  recommendations as fallbackRecommendations,
  recentItems as fallbackRecent,
  services as fallbackServices,
  tools,
} from '../mockData';
import { ApiItem, DocItem, RecommendationItem, ServiceItem, VisitItem } from '../types';
import { loadPinned, loadRecent } from '../utils/userSignals';

type EntityLike = {
  metadata?: {
    uid?: string;
    name?: string;
    namespace?: string;
    description?: string;
    tags?: string[];
    annotations?: Record<string, string>;
  };
  spec?: {
    owner?: string;
    type?: string;
    lifecycle?: string;
    domain?: string;
  };
};

const mapService = (entity: EntityLike): ServiceItem => ({
  id: entity.metadata?.uid || entity.metadata?.name || 'component',
  name: entity.metadata?.name || 'unknown-service',
  owner: entity.spec?.owner || 'unknown-owner',
  domain: entity.spec?.domain || entity.metadata?.namespace || 'default',
  runtime: entity.spec?.type || 'unknown-runtime',
  environment: entity.metadata?.annotations?.['backstage.io/environment'] || 'unknown',
  tags: entity.metadata?.tags || [],
});

const toLifecycle = (lifecycle: string | undefined): ApiItem['lifecycle'] => {
  if (lifecycle === 'production' || lifecycle === 'beta' || lifecycle === 'experimental') {
    return lifecycle;
  }
  return 'beta';
};

const mapApi = (entity: EntityLike): ApiItem => ({
  id: entity.metadata?.uid || entity.metadata?.name || 'api',
  name: entity.metadata?.name || 'unknown-api',
  owner: entity.spec?.owner || 'unknown-owner',
  domain: entity.spec?.domain || entity.metadata?.namespace || 'default',
  lifecycle: toLifecycle(entity.spec?.lifecycle),
  tags: entity.metadata?.tags || [],
  summary: entity.metadata?.description || 'No summary available yet.',
});

const mapDoc = (entity: EntityLike): DocItem => {
  const title = entity.metadata?.name || 'Untitled Doc';
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return {
    id: entity.metadata?.uid || title,
    title,
    owner: entity.spec?.owner || 'unknown-owner',
    domain: entity.spec?.domain || entity.metadata?.namespace || 'default',
    tags: entity.metadata?.tags || [],
    reads: 100 + (hash % 500),
  };
};

export const usePortalData = () => {
  const catalogApi = useApi(catalogApiRef);
  const identityApi = useApi(identityApiRef);

  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<ServiceItem[]>(fallbackServices);
  const [apis, setApis] = useState<ApiItem[]>(fallbackApis);
  const [docs, setDocs] = useState<DocItem[]>(fallbackDocs);
  const [recommendations, setRecommendations] =
    useState<RecommendationItem[]>(fallbackRecommendations);
  const [recentItems, setRecentItems] = useState<VisitItem[]>(fallbackRecent);
  const [pinnedItems, setPinnedItems] = useState<VisitItem[]>(fallbackPinned);

  const mergedRecommendations = useMemo(() => {
    const fromPinned: RecommendationItem[] = pinnedItems.slice(0, 2).map(item => ({
      id: `starred-${item.id}`,
      title: item.title,
      reason: 'Starred by you',
      type:
        item.section === 'apis'
          ? 'api'
          : item.section === 'docs'
            ? 'doc'
            : item.section === 'toolbox'
              ? 'tool'
              : 'service',
      owner: 'self',
      to: item.to,
    }));

    const combined = [...recommendations, ...fromPinned];
    return combined.filter(
      (item, index, all) => all.findIndex(candidate => candidate.title === item.title) === index,
    );
  }, [pinnedItems, recommendations]);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);

      try {
        const identity = await identityApi.getBackstageIdentity();
        const userRef = identity.userEntityRef.toLowerCase();
        const userToken = userRef.split('/').pop() || userRef;

        const [componentResp, apiResp] = await Promise.all([
          (catalogApi as any).getEntities({ filter: [{ kind: 'Component' }] }),
          (catalogApi as any).getEntities({ filter: [{ kind: 'API' }] }),
        ]);

        const componentItems: EntityLike[] = componentResp?.items || [];
        const apiItems: EntityLike[] = apiResp?.items || [];

        const mappedServices = componentItems.map(mapService);
        const mappedApis = apiItems.map(mapApi);

        const mappedDocs = componentItems
          .filter(entity => Boolean(entity.metadata?.annotations?.['backstage.io/techdocs-ref']))
          .map(mapDoc);

        const recFromOwnership: RecommendationItem[] = [];

        mappedServices.forEach(item => {
          if (item.owner.toLowerCase().includes(userToken) && recFromOwnership.length < 2) {
            recFromOwnership.push({
              id: `rec-svc-${item.id}`,
              title: item.name,
              reason: 'Owned by your team',
              type: 'service',
              owner: item.owner,
              to: '/start/catalog',
            });
          }
        });

        mappedApis.forEach(item => {
          if (item.owner.toLowerCase().includes(userToken) && recFromOwnership.length < 4) {
            recFromOwnership.push({
              id: `rec-api-${item.id}`,
              title: item.name,
              reason: 'API owned by your team',
              type: 'api',
              owner: item.owner,
              to: '/start/apis',
            });
          }
        });

        if (!mounted) {
          return;
        }

        setServices(mappedServices.length > 0 ? mappedServices : fallbackServices);
        setApis(mappedApis.length > 0 ? mappedApis : fallbackApis);
        setDocs(mappedDocs.length > 0 ? mappedDocs : fallbackDocs);
        setRecommendations(
          recFromOwnership.length > 0 ? recFromOwnership : fallbackRecommendations,
        );
      } catch {
        if (!mounted) {
          return;
        }

        setServices(fallbackServices);
        setApis(fallbackApis);
        setDocs(fallbackDocs);
        setRecommendations(fallbackRecommendations);
      } finally {
        if (mounted) {
          const recent = loadRecent();
          const pinned = loadPinned();
          setRecentItems(recent.length > 0 ? recent : fallbackRecent);
          setPinnedItems(pinned.length > 0 ? pinned : fallbackPinned);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [catalogApi, identityApi]);

  return useMemo(
    () => ({
      loading,
      quickActions,
      services,
      apis,
      docs,
      tools,
      playlists,
      recommendations,
      recentItems,
      pinnedItems,
      personalizedRecommendations: mergedRecommendations,
    }),
    [
      loading,
      services,
      apis,
      docs,
      recommendations,
      recentItems,
      pinnedItems,
      mergedRecommendations,
    ],
  );
};
