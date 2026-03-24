import {
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { Link } from '@backstage/core-components';
import { VisitItem } from '../../types';

const useStyles = makeStyles(theme => ({
  panel: {
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    height: '100%',
  },
}));

type RecentProps = {
  recent: VisitItem[];
  pinned: VisitItem[];
  onSelect?: (item: VisitItem) => void;
};

const VisitList = ({
  title,
  items,
  onSelect,
}: {
  title: string;
  items: VisitItem[];
  onSelect?: (item: VisitItem) => void;
}) => {
  const classes = useStyles();

  return (
    <Paper className={classes.panel}>
      <Typography variant="h6">{title}</Typography>
      <List aria-label={title}>
        {items.map(item => (
          <ListItem key={item.id} divider>
            <ListItemText
              primary={<Link to={item.to} onClick={() => onSelect?.(item)}>{item.title}</Link>}
              secondary={`${item.subtitle} • ${item.section}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export const Recent = ({ recent, pinned, onSelect }: RecentProps) => {
  return (
    <Grid container spacing={2}>
      <Grid item md={6} xs={12}>
        <VisitList title="Recently visited" items={recent} onSelect={onSelect} />
      </Grid>
      <Grid item md={6} xs={12}>
        <VisitList title="Pinned" items={pinned} onSelect={onSelect} />
      </Grid>
    </Grid>
  );
};
