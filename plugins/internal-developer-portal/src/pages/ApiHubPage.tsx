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
    gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  card: {
    height: '100%',
    border: `1px solid ${theme.palette.divider}`,
  },
  chips: {
    display: 'flex',
    gap: theme.spacing(0.5),
    flexWrap: 'wrap',
    marginTop: theme.spacing(1),
  },
}));

export const ApiHubPage = () => {
  const classes = useStyles();
  const { apis } = usePortalData();
  const [owner, setOwner] = useState('all');
  const [domain, setDomain] = useState('all');
  const [lifecycle, setLifecycle] = useState('all');

  const owners = ['all', ...Array.from(new Set(apis.map(item => item.owner)))];
  const domains = ['all', ...Array.from(new Set(apis.map(item => item.domain)))];
  const lifecycles = ['all', ...Array.from(new Set(apis.map(item => item.lifecycle)))];

  const filtered = useMemo(
    () =>
      apis.filter(
        api =>
          (owner === 'all' || api.owner === owner) &&
          (domain === 'all' || api.domain === domain) &&
          (lifecycle === 'all' || api.lifecycle === lifecycle),
      ),
    [owner, domain, lifecycle],
  );

  return (
    <PageFrame
      title="API Hub"
      subtitle="Browse APIs with filters and inspect API details quickly."
      breadcrumbs={[{ label: 'Start', to: '/start' }, { label: 'Build & Run' }, { label: 'APIs' }]}
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
        <TextField select label="Lifecycle" variant="outlined" size="small" value={lifecycle} onChange={e => setLifecycle(e.target.value)}>
          {lifecycles.map(value => (
            <MenuItem key={value} value={value}>{value}</MenuItem>
          ))}
        </TextField>
      </div>

      <Grid container spacing={2}>
        {filtered.length === 0 && (
          <Grid item xs={12}>
            <Typography color="textSecondary">
              No APIs found. Try removing one or more filters.
            </Typography>
          </Grid>
        )}
        {filtered.map(api => (
          <Grid item md={4} sm={6} xs={12} key={api.id}>
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="h6">{api.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {api.summary}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  owner: {api.owner} • {api.lifecycle}
                </Typography>
                <div className={classes.chips}>
                  {api.tags.map(tag => (
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
