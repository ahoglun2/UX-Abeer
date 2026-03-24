import { useState } from 'react';
import { Box, Chip, Grid, InputBase, Paper, Typography, makeStyles } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { Link } from '@backstage/core-components';
import { PageFrame } from '../Layout/PageFrame';
import { QuickActions } from './QuickActions';
import { Recommendations } from './Recommendations';
import { Recent } from './Recent';
import { usePortalData } from '../../hooks/usePortalData';
import { usePortalTelemetry } from '../../hooks/usePortalTelemetry';
import { recordVisit } from '../../utils/userSignals';
import { VisitItem } from '../../types';

const useStyles = makeStyles(theme => ({
  section: {
    marginBottom: theme.spacing(3),
  },
  onboarding: {
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
  },
  step: {
    marginBottom: theme.spacing(1),
  },
  topSearch: {
    minWidth: 320,
    maxWidth: 920,
    width: '100%',
    backgroundColor: '#f4f4f4',
    borderRadius: 4,
    padding: theme.spacing(1),
  },
  topSearchField: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    backgroundColor: '#ffffff',
    border: '1px solid #d6d6d6',
    borderRadius: 4,
    minHeight: 38,
    padding: theme.spacing(0, 1.25),
  },
  topSearchIcon: {
    color: '#6b7280',
  },
  topSearchInput: {
    flex: 1,
    fontSize: '0.95rem',
    color: '#2f2f2f',
  },
  topCardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: 12,
    marginBottom: 10,
    '@media (max-width: 1200px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    '@media (max-width: 900px)': {
      gridTemplateColumns: 'minmax(0, 1fr)',
    },
  },
  ownedServicesCard: {
    padding: 16,
    border: '1px solid #d8dee8',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  recentEntitiesCard: {
    padding: 16,
    border: '1px solid #d8dee8',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  favoritesCard: {
    padding: 16,
    border: '1px solid #d8dee8',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  ownedServicesHeader: {
    marginBottom: 4,
  },
  ownedServicesSub: {
    marginBottom: 12,
  },
  ownedServicesList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 10,
    '@media (max-width: 900px)': {
      gridTemplateColumns: 'minmax(0, 1fr)',
    },
  },
  ownedServiceItem: {
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f9fafb',
  },
  ownedServiceName: {
    fontWeight: 600,
    marginBottom: 4,
  },
  ownedServiceMeta: {
    color: '#6b7280',
    marginBottom: 8,
  },
  ownedServiceTags: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap',
  },
  serviceOpsFrames: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 10,
    marginBottom: 10,
    '@media (max-width: 900px)': {
      gridTemplateColumns: 'minmax(0, 1fr)',
    },
  },
  serviceOpsFrame: {
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f9fafb',
  },
  serviceOpsTitle: {
    fontWeight: 700,
    marginBottom: 6,
  },
  serviceOpsMeta: {
    color: '#6b7280',
    marginBottom: 8,
  },
  serviceOpsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 6,
  },
  serviceOpsLabel: {
    color: '#4b5563',
  },
  healthChipHealthy: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  healthChipWarning: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  recentEntitiesList: {
    display: 'grid',
    gap: 10,
  },
  recentEntityItem: {
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f9fafb',
  },
  recentEntityName: {
    fontWeight: 600,
    marginBottom: 4,
  },
  recentEntityMeta: {
    color: '#6b7280',
  },
  favoritesList: {
    display: 'grid',
    gap: 10,
  },
  favoriteItem: {
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f9fafb',
  },
  favoriteName: {
    fontWeight: 600,
    marginBottom: 4,
  },
  favoriteMeta: {
    color: '#6b7280',
  },
  quickActionsFrame: {
    padding: 16,
    border: '1px solid #d8dee8',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
}));

const PIF_SERVICE_NAME = 'PIF';

export const HomePage = () => {
  const classes = useStyles();
  const [query, setQuery] = useState('');
  const data = usePortalData();
  const telemetry = usePortalTelemetry();

  const ownedServiceNames = new Set(
    data.personalizedRecommendations
      .filter(item => item.type === 'service' && item.reason.toLowerCase().includes('owned'))
      .map(item => item.title.toLowerCase()),
  );

  const ownedServices = (
    data.services.filter(service => ownedServiceNames.has(service.name.toLowerCase())).length > 0
      ? data.services.filter(service => ownedServiceNames.has(service.name.toLowerCase()))
      : data.services
  ).slice(0, 4);

  const exampleWebsiteService =
    ownedServices.find(service => /web|frontend|site|portal/i.test(service.name)) ||
    ownedServices[0] || {
      id: 'pif-service',
      name: 'PIF',
      owner: 'Abeer',
      domain: 'web',
      runtime: 'React',
      environment: 'prod',
      tags: [],
    };

  const activeAlerts = exampleWebsiteService.environment === 'prod' ? 2 : 0;
  const healthStatus = activeAlerts > 0 ? 'Needs attention' : 'Healthy';
  const ucpActiveAlerts = 2;
  const ucpHealthStatus = ucpActiveAlerts > 0 ? 'Needs attention' : 'Healthy';

  const recentlyViewedEntities = data.recentItems.slice(0, 4);
  const starredServices = data.pinnedItems.slice(0, 4);

  const handleSearchChange = (value: string) => {
    setQuery(value);
    if (value.trim().length > 1) {
      telemetry.trackSearch(value);
    }
  };

  const handleNavigate = (source: string, item: VisitItem) => {
    recordVisit(item);
    telemetry.trackNavigation(source, item.to);
  };

  return (
    <PageFrame
      title="Hello Gorgeous"
      subtitle="Trusted standard toolbox for finding services, docs, APIs, and tools fast."
      breadcrumbs={[]}
      topLeftContent={
        <div className={classes.topSearch}>
          <Paper className={classes.topSearchField} elevation={0} role="search" aria-label="Top page search">
            <SearchIcon fontSize="small" className={classes.topSearchIcon} />
            <InputBase
              className={classes.topSearchInput}
              placeholder="Search"
              value={query}
              onChange={event => handleSearchChange(event.target.value)}
              inputProps={{ 'aria-label': 'Search' }}
            />
          </Paper>
        </div>
      }
    >
      <div className={classes.section}>
        <div className={classes.topCardsGrid}>
          <Paper className={classes.ownedServicesCard}>
            <Typography variant="h6" className={classes.ownedServicesHeader}>
              Owned services
            </Typography>
            <Typography variant="body2" className={classes.ownedServicesSub}>
              Services owned by your team and frequently used in your workflows.
            </Typography>

            <div className={classes.serviceOpsFrames}>
              <div className={classes.serviceOpsFrame}>
                <Typography variant="subtitle2" className={classes.serviceOpsTitle}>
                  PIF
                </Typography>
                <Typography variant="caption" className={classes.serviceOpsMeta}>
                  <Link
                    to="/start/catalog"
                    onClick={() =>
                      handleNavigate('owned-services-example', {
                        id: `owned-example-${exampleWebsiteService.id}`,
                        title: PIF_SERVICE_NAME,
                        subtitle: PIF_SERVICE_NAME,
                        section: 'catalog',
                        to: '/start/catalog',
                      })
                    }
                  >
                    {PIF_SERVICE_NAME}
                  </Link>
                  {' '}• PIF.owner: {exampleWebsiteService.owner}
                </Typography>
                <div className={classes.ownedServiceTags}>
                  <Chip size="small" label={exampleWebsiteService.runtime} />
                  <Chip size="small" label={exampleWebsiteService.environment} />
                </div>
              </div>

              <div className={classes.serviceOpsFrame}>
                <Typography variant="subtitle2" className={classes.serviceOpsTitle}>
                  Alerts & health check for PIF
                </Typography>
                <div className={classes.serviceOpsRow}>
                  <Typography variant="caption" className={classes.serviceOpsLabel}>
                    Active alerts
                  </Typography>
                  <Chip
                    size="small"
                    label={String(activeAlerts)}
                    className={activeAlerts > 0 ? classes.healthChipWarning : classes.healthChipHealthy}
                  />
                </div>
                <div className={classes.serviceOpsRow}>
                  <Typography variant="caption" className={classes.serviceOpsLabel}>
                    Health check
                  </Typography>
                  <Chip
                    size="small"
                    label={healthStatus}
                    className={activeAlerts > 0 ? classes.healthChipWarning : classes.healthChipHealthy}
                  />
                </div>
              </div>

              <div className={classes.serviceOpsFrame}>
                <Typography variant="subtitle2" className={classes.serviceOpsTitle}>
                  UCP
                </Typography>
                <Typography variant="caption" className={classes.serviceOpsMeta}>
                  <Link
                    to="/start/catalog"
                    onClick={() =>
                      handleNavigate('owned-services-ucp', {
                        id: `owned-ucp-${exampleWebsiteService.id}`,
                        title: 'UCP',
                        subtitle: 'UCP',
                        section: 'catalog',
                        to: '/start/catalog',
                      })
                    }
                  >
                    UCP
                  </Link>
                  {' '}• UCP.owner: Abeer
                </Typography>
                <div className={classes.ownedServiceTags}>
                  <Chip size="small" label={exampleWebsiteService.runtime} />
                  <Chip size="small" label={exampleWebsiteService.environment} />
                </div>
              </div>

              <div className={classes.serviceOpsFrame}>
                <Typography variant="subtitle2" className={classes.serviceOpsTitle}>
                  Alerts & health check for UCP
                </Typography>
                <div className={classes.serviceOpsRow}>
                  <Typography variant="caption" className={classes.serviceOpsLabel}>
                    Active alerts
                  </Typography>
                  <Chip
                    size="small"
                    label={String(ucpActiveAlerts)}
                    className={ucpActiveAlerts > 0 ? classes.healthChipWarning : classes.healthChipHealthy}
                  />
                </div>
                <div className={classes.serviceOpsRow}>
                  <Typography variant="caption" className={classes.serviceOpsLabel}>
                    Health check
                  </Typography>
                  <Chip
                    size="small"
                    label={ucpHealthStatus}
                    className={ucpActiveAlerts > 0 ? classes.healthChipWarning : classes.healthChipHealthy}
                  />
                </div>
              </div>
            </div>
          </Paper>

          <Paper className={classes.recentEntitiesCard}>
            <Typography variant="h6" className={classes.ownedServicesHeader}>
              Recently viewed entities
            </Typography>
            <Typography variant="body2" className={classes.ownedServicesSub}>
              Continue where you left off with entities you opened most recently.
            </Typography>

            <div className={classes.recentEntitiesList}>
              {recentlyViewedEntities.map(item => (
                <div key={item.id} className={classes.recentEntityItem}>
                  <Typography variant="subtitle2" className={classes.recentEntityName}>
                    <Link to={item.to} onClick={() => handleNavigate('recent-entities', item)}>
                      {item.title}
                    </Link>
                  </Typography>
                  <Typography variant="caption" className={classes.recentEntityMeta}>
                    {item.subtitle} • {item.section}
                  </Typography>
                </div>
              ))}
            </div>
          </Paper>

          <Paper className={classes.favoritesCard}>
            <Typography variant="h6" className={classes.ownedServicesHeader}>
              Favorites / starred services
            </Typography>
            <Typography variant="body2" className={classes.ownedServicesSub}>
              Your pinned entities and starred services for quick access.
            </Typography>

            <div className={classes.favoritesList}>
              {starredServices.map(item => (
                <div key={item.id} className={classes.favoriteItem}>
                  <Typography variant="subtitle2" className={classes.favoriteName}>
                    <Link to={item.to} onClick={() => handleNavigate('favorites', item)}>
                      {item.title}
                    </Link>
                  </Typography>
                  <Typography variant="caption" className={classes.favoriteMeta}>
                    {item.subtitle} • {item.section}
                  </Typography>
                </div>
              ))}
            </div>
          </Paper>
        </div>

        <Typography variant="caption" color="textSecondary">
          Discoverability metric: {telemetry.metrics.under30Rate}% first-find under 30 seconds, average{' '}
          {Math.round(telemetry.metrics.averageFirstFindMs / 1000) || 0}s.
        </Typography>
      </div>

      <div className={classes.section}>
        <Paper className={classes.quickActionsFrame}>
          <Typography variant="h6" gutterBottom>
            Quick actions
          </Typography>
          <QuickActions
            actions={data.quickActions}
            onAction={action =>
              handleNavigate('quick-action', {
                id: `quick-${action.id}`,
                title: action.title,
                subtitle: 'Quick action',
                section: 'toolbox',
                to: action.to,
              })
            }
          />
        </Paper>
      </div>

      <Grid container spacing={2} className={classes.section}>
        <Grid item md={8} xs={12}>
          <Recommendations
            items={data.personalizedRecommendations}
            query={query}
            onSelect={item =>
              handleNavigate('recommendation', {
                id: `rec-${item.id}`,
                title: item.title,
                subtitle: item.reason,
                section: item.type === 'api' ? 'apis' : item.type === 'doc' ? 'docs' : item.type === 'tool' ? 'toolbox' : 'catalog',
                to: item.to,
              })
            }
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <Paper className={classes.onboarding}>
            <Typography variant="h6">Getting started</Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              New to Backstage? Follow this path to be productive in under 30 minutes.
            </Typography>
            <Box className={classes.step}>
              <Typography variant="body2">
                1. Find your team services in <Link to="/start/catalog">Service Catalog</Link>
              </Typography>
            </Box>
            <Box className={classes.step}>
              <Typography variant="body2">
                2. Read standards in <Link to="/start/radar">Tech Radar</Link>
              </Typography>
            </Box>
            <Box className={classes.step}>
              <Typography variant="body2">
                3. Create safely via <Link to="/create">Templates</Link>
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <div className={classes.section}>
        <Recent
          recent={data.recentItems}
          pinned={data.pinnedItems}
          onSelect={item => handleNavigate('history', item)}
        />
      </div>
    </PageFrame>
  );
};
