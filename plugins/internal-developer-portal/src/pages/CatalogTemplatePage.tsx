import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  Chip,
  Grid,
  MenuItem,
  TextField,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { PageFrame } from '../components/Layout/PageFrame';
import { usePortalData } from '../hooks/usePortalData';

const useStyles = makeStyles(theme => ({
  filterRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  card: {
    height: '100%',
    border: `1px solid ${theme.palette.divider}`,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.5),
    marginTop: theme.spacing(1),
  },
}));

export const CatalogTemplatePage = () => {
  const classes = useStyles();
  const { services } = usePortalData();
  const [owner, setOwner] = useState('all');
  const [domain, setDomain] = useState('all');
  const [runtime, setRuntime] = useState('all');
  const [environment, setEnvironment] = useState('all');

  const owners = ['all', ...Array.from(new Set(services.map(item => item.owner)))];
  const domains = ['all', ...Array.from(new Set(services.map(item => item.domain)))];
  const runtimes = ['all', ...Array.from(new Set(services.map(item => item.runtime)))];
  const environments = ['all', ...Array.from(new Set(services.map(item => item.environment)))];

  const filtered = useMemo(
    () =>
      services.filter(
        item =>
          (owner === 'all' || item.owner === owner) &&
          (domain === 'all' || item.domain === domain) &&
          (runtime === 'all' || item.runtime === runtime) &&
          (environment === 'all' || item.environment === environment),
      ),
    [owner, domain, runtime, environment],
  );

  return (
    <PageFrame
      title="Service Catalog"
      subtitle="Overview, ownership, links, docs, APIs, runbooks, and dashboards."
      breadcrumbs={[{ label: 'Start', to: '/start' }, { label: 'Build & Run' }, { label: 'Service Catalog' }]}
    >
      <div className={classes.filterRow}>
        <TextField select label="Owner" variant="outlined" size="small" value={owner} onChange={e => setOwner(e.target.value)}>
          {owners.map(value => (
            <MenuItem key={value} value={value}>{value}</MenuItem>
          ))}
        </TextField>
        <TextField select label="Domain" variant="outlined" size="small" value={domain} onChange={e => setDomain(e.target.value)}>
          {domains.map(value => (
            <MenuItem key={value} value={value}>{value}</MenuItem>
          ))}
        </TextField>
        <TextField select label="Runtime" variant="outlined" size="small" value={runtime} onChange={e => setRuntime(e.target.value)}>
          {runtimes.map(value => (
            <MenuItem key={value} value={value}>{value}</MenuItem>
          ))}
        </TextField>
        <TextField select label="Environment" variant="outlined" size="small" value={environment} onChange={e => setEnvironment(e.target.value)}>
          {environments.map(value => (
            <MenuItem key={value} value={value}>{value}</MenuItem>
          ))}
        </TextField>
      </div>

      <Grid container spacing={2}>
        {filtered.length === 0 && (
          <Grid item xs={12}>
            <Typography color="textSecondary">
              No services found. Try broadening filters or searching by owner/domain.
            </Typography>
          </Grid>
        )}
        {filtered.map(service => (
          <Grid item md={4} sm={6} xs={12} key={service.id}>
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="h6">{service.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  owner: {service.owner} • domain: {service.domain}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  runtime: {service.runtime} • env: {service.environment}
                </Typography>
                <div className={classes.chips}>
                  {service.tags.map(tag => (
                    <Chip key={tag} size="small" label={tag} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </PageFrame>
  );
};
