import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  makeStyles,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import AddBoxIcon from '@material-ui/icons/AddBox';
import GroupIcon from '@material-ui/icons/Group';
import TrackChangesIcon from '@material-ui/icons/TrackChanges';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import { Link } from '@backstage/core-components';
import { QuickAction } from '../../types';

const useStyles = makeStyles(() => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
    gap: 12,
    '@media (max-width: 1400px)': {
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    },
    '@media (max-width: 900px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    '@media (max-width: 600px)': {
      gridTemplateColumns: 'minmax(0, 1fr)',
    },
  },
  card: {
    height: '100%',
    border: '1px solid #d8dee8',
    borderRadius: 8,
    overflow: 'hidden',
    transition: 'transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.08)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 16px rgba(15, 23, 42, 0.14)',
      borderColor: '#c7d0de',
    },
  },
  actionArea: {
    height: '100%',
  },
  content: {
    padding: 14,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    color: '#4b5563',
  },
  iconBlue: {
    color: '#2563eb',
  },
  iconGreen: {
    color: '#16a34a',
  },
  iconOrange: {
    color: '#ea580c',
  },
  iconPurple: {
    color: '#7c3aed',
  },
  iconRed: {
    color: '#dc2626',
  },
  title: {
    fontWeight: 600,
    color: '#111827',
    lineHeight: 1.3,
    marginBottom: 4,
  },
  description: {
    color: '#6b7280',
    lineHeight: 1.35,
    minHeight: 54,
  },
}));

const getActionIcon = (action: QuickAction) => {
  const text = `${action.id} ${action.title}`.toLowerCase();
  if (text.includes('service') || text.includes('catalog') || text.includes('find')) {
    return SearchIcon;
  }
  if (text.includes('access') || text.includes('permission')) {
    return VpnKeyIcon;
  }
  if (text.includes('template') || text.includes('create')) {
    return AddBoxIcon;
  }
  if (text.includes('owner') || text.includes('on-call') || text.includes('team')) {
    return GroupIcon;
  }
  if (text.includes('standard') || text.includes('radar')) {
    return TrackChangesIcon;
  }
  return FlashOnIcon;
};

const isFindServiceAction = (action: QuickAction) => {
  const text = `${action.id} ${action.title}`.toLowerCase();
  return text.includes('find a service') || (text.includes('find') && text.includes('service'));
};

const isRequestAccessAction = (action: QuickAction) => {
  const text = `${action.id} ${action.title}`.toLowerCase();
  return text.includes('request access') || (text.includes('request') && text.includes('access'));
};

const isCreateFromTemplateAction = (action: QuickAction) => {
  const text = `${action.id} ${action.title}`.toLowerCase();
  return text.includes('create from template') || (text.includes('create') && text.includes('template'));
};

const isOwnershipAction = (action: QuickAction) => {
  const text = `${action.id} ${action.title}`.toLowerCase();
  return text.includes('ownership') || text.includes('owner') || text.includes('on-call');
};

const isTechStandardsAction = (action: QuickAction) => {
  const text = `${action.id} ${action.title}`.toLowerCase();
  return text.includes('tech standards') || text.includes('standards') || text.includes('radar');
};

type QuickActionsProps = {
  actions: QuickAction[];
  onAction?: (action: QuickAction) => void;
};

export const QuickActions = ({ actions, onAction }: QuickActionsProps) => {
  const classes = useStyles();

  return (
    <div className={classes.grid} aria-label="Quick actions">
      {actions.map(action => {
        const ActionIcon = getActionIcon(action);
        const iconClassName = isFindServiceAction(action)
          ? `${classes.iconWrap} ${classes.iconBlue}`
          : isRequestAccessAction(action)
            ? `${classes.iconWrap} ${classes.iconGreen}`
            : isCreateFromTemplateAction(action)
              ? `${classes.iconWrap} ${classes.iconOrange}`
              : isOwnershipAction(action)
                ? `${classes.iconWrap} ${classes.iconPurple}`
                : isTechStandardsAction(action)
                  ? `${classes.iconWrap} ${classes.iconRed}`
            : classes.iconWrap;

        return (
          <Link key={action.id} to={action.to} underline="none" onClick={() => onAction?.(action)}>
            <Card className={classes.card}>
              <CardActionArea className={classes.actionArea} aria-label={action.title}>
                <CardContent className={classes.content}>
                  <Box className={iconClassName}>
                    <ActionIcon fontSize="small" />
                  </Box>
                  <Typography variant="subtitle2" className={classes.title}>
                    {action.title}
                  </Typography>
                  <Typography variant="body2" className={classes.description}>
                    {action.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};
