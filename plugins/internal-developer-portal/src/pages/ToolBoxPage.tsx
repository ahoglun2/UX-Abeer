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
  controls: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
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

export const ToolBoxPage = () => {
  const classes = useStyles();
  const { tools } = usePortalData();
  const [category, setCategory] = useState('all');
  const [tagQuery, setTagQuery] = useState('');

  const categories = ['all', ...Array.from(new Set(tools.map(item => item.category)))];

  const filtered = useMemo(
    () =>
      tools.filter(
        tool =>
          (category === 'all' || tool.category === category) &&
          `${tool.name} ${tool.tags.join(' ')}`.toLowerCase().includes(tagQuery.toLowerCase()),
      ),
    [category, tagQuery],
  );

  return (
    <PageFrame
      title="Tool Box"
      subtitle="Find categorized utilities with tags and usage signals."
      breadcrumbs={[{ label: 'Start', to: '/start' }, { label: 'Utilities' }, { label: 'Tool Box' }]}
    >
      <div className={classes.controls}>
        <TextField select label="Category" variant="outlined" size="small" value={category} onChange={e => setCategory(e.target.value)}>
          {categories.map(value => (
            <MenuItem key={value} value={value}>{value}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Tag / keyword"
          variant="outlined"
          size="small"
          value={tagQuery}
          onChange={e => setTagQuery(e.target.value)}
          inputProps={{ 'aria-label': 'Tool tags filter' }}
        />
      </div>

      <Grid container spacing={2}>
        {filtered.length === 0 && (
          <Grid item xs={12}>
            <Typography color="textSecondary">
              No tools found. Try another tag or clear category filters.
            </Typography>
          </Grid>
        )}
        {filtered
          .sort((a, b) => b.usedCount - a.usedCount)
          .map(tool => (
            <Grid item md={4} sm={6} xs={12} key={tool.id}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h6">{tool.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {tool.description}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    category: {tool.category} • most used: {tool.usedCount}
                  </Typography>
                  <div className={classes.chips}>
                    {tool.tags.map(tag => (
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
