import { Card, CardContent, Grid, Typography, makeStyles } from '@material-ui/core';
import { PageFrame } from '../components/Layout/PageFrame';

const useStyles = makeStyles(theme => ({
  card: {
    border: `1px solid ${theme.palette.divider}`,
    height: '100%',
  },
}));

const standards = [
  { ring: 'Adopt', items: ['TypeScript for services', 'OpenAPI 3.0 contracts'] },
  { ring: 'Trial', items: ['Kubernetes progressive delivery', 'Service scorecards'] },
  { ring: 'Assess', items: ['Platform golden paths', 'LLM-assisted runbooks'] },
  { ring: 'Hold', items: ['Unversioned APIs', 'Undocumented ownership handovers'] },
];

export const TechRadarPage = () => {
  const classes = useStyles();

  return (
    <PageFrame
      title="Tech Radar"
      subtitle="Shared standards to align technology decisions across teams."
      breadcrumbs={[{ label: 'Start', to: '/start' }, { label: 'Standards' }, { label: 'Tech Radar' }]}
    >
      <Grid container spacing={2}>
        {standards.map(ring => (
          <Grid item md={3} sm={6} xs={12} key={ring.ring}>
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="h6">{ring.ring}</Typography>
                {ring.items.map(item => (
                  <Typography key={item} variant="body2" color="textSecondary">
                    • {item}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </PageFrame>
  );
};
