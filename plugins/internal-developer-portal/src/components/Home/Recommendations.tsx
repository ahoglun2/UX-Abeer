import {
  Chip,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { Link } from '@backstage/core-components';
import { RecommendationItem } from '../../types';

const useStyles = makeStyles(theme => ({
  panel: {
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}));

type RecommendationsProps = {
  items: RecommendationItem[];
  query: string;
  onSelect?: (item: RecommendationItem) => void;
};

export const Recommendations = ({ items, query, onSelect }: RecommendationsProps) => {
  const classes = useStyles();

  const filtered = items.filter(item =>
    `${item.title} ${item.reason} ${item.owner}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Paper className={classes.panel}>
      <Typography variant="h6">Recommended for you</Typography>
      <Typography variant="body2" color="textSecondary">
        Based on ownership, starred resources, and recent activity.
      </Typography>
      <List aria-label="Recommended resources">
        {filtered.length === 0 && (
          <ListItem>
            <ListItemText primary="No recommendations match your search" secondary="Try a broader keyword such as service, API, or runbook." />
          </ListItem>
        )}
        {filtered.map(item => (
          <ListItem key={item.id} divider>
            <ListItemText
              primary={<Link to={item.to} onClick={() => onSelect?.(item)}>{item.title}</Link>}
              secondary={`${item.reason} • owner: ${item.owner}`}
            />
            <div className={classes.row}>
              <Chip size="small" label={item.type.toUpperCase()} />
            </div>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};
