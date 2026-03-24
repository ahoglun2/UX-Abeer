import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  card: {
    height: '100%',
    border: `1px solid ${theme.palette.divider}`,
  },
}));

export const DocsHubPage = () => {
  const classes = useStyles();
  const { docs } = usePortalData();
  const [query, setQuery] = useState('');
  const [owner, setOwner] = useState('all');

  const owners = ['all', ...Array.from(new Set(docs.map(item => item.owner)))];

  const filtered = useMemo(
    () =>
      docs
        .filter(doc => owner === 'all' || doc.owner === owner)
        .filter(doc => `${doc.title} ${doc.domain} ${doc.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())),
    [owner, query],
  );

  const topDocs = [...docs].sort((a, b) => b.reads - a.reads).slice(0, 3);

  return (
    <PageFrame
      title="Docs Hub"
      subtitle="Search docs by topic and discover top-read knowledge assets."
      breadcrumbs={[{ label: 'Start', to: '/start' }, { label: 'Learn' }, { label: 'Docs' }]}
    >
      <div className={classes.filterRow}>
        <TextField
          label="Search docs"
          variant="outlined"
          size="small"
          value={query}
          onChange={e => setQuery(e.target.value)}
          inputProps={{ 'aria-label': 'Doc search input' }}
        />
        <TextField select label="Owner" variant="outlined" size="small" value={owner} onChange={e => setOwner(e.target.value)}>
          {owners.map(value => (
            <MenuItem key={value} value={value}>{value}</MenuItem>
          ))}
        </TextField>
      </div>

      <Typography variant="subtitle1" gutterBottom>
        Top docs this week
      </Typography>
      <Grid container spacing={2}>
        {topDocs.map(doc => (
          <Grid item md={4} xs={12} key={doc.id}>
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="subtitle1">{doc.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  owner: {doc.owner} • reads: {doc.reads}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="subtitle1" style={{ marginTop: 16 }} gutterBottom>
        Search results
      </Typography>
      <Grid container spacing={2}>
        {filtered.length === 0 && (
          <Grid item xs={12}>
            <Typography color="textSecondary">
              No docs found. Try another keyword or remove the owner filter.
            </Typography>
          </Grid>
        )}
        {filtered.map(doc => (
          <Grid item md={4} sm={6} xs={12} key={doc.id}>
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="subtitle1">{doc.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  owner: {doc.owner} • domain: {doc.domain}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  tags: {doc.tags.join(', ')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </PageFrame>
  );
};
