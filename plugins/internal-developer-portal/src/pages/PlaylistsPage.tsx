import { Card, CardContent, Chip, Grid, Typography, makeStyles } from '@material-ui/core';
import { PageFrame } from '../components/Layout/PageFrame';
import { usePortalData } from '../hooks/usePortalData';

const useStyles = makeStyles(theme => ({
  card: {
    height: '100%',
    border: `1px solid ${theme.palette.divider}`,
  },
  item: {
    marginTop: theme.spacing(0.5),
  },
}));

export const PlaylistsPage = () => {
  const classes = useStyles();
  const { playlists } = usePortalData();

  return (
    <PageFrame
      title="Playlists"
      subtitle="Role-based paths through docs, tools, and services with time estimates."
      breadcrumbs={[{ label: 'Start', to: '/start' }, { label: 'Learn' }, { label: 'Playlists' }]}
    >
      <Grid container spacing={2}>
        {playlists.map(playlist => (
          <Grid item md={6} xs={12} key={playlist.id}>
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="h6">{playlist.title}</Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  role: {playlist.role}
                </Typography>
                <Chip label={`${playlist.estimateMinutes} min`} size="small" />
                {playlist.items.map(step => (
                  <Typography key={step} className={classes.item} variant="body2">
                    • {step}
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
