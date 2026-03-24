import React from 'react';
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  makeStyles,
} from '@material-ui/core';
import BuildIcon from '@material-ui/icons/Build';
import DescriptionIcon from '@material-ui/icons/Description';
import GavelIcon from '@material-ui/icons/Gavel';
import AppsIcon from '@material-ui/icons/Apps';
import HomeIcon from '@material-ui/icons/Home';
import ExtensionIcon from '@material-ui/icons/Extension';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import PlaylistPlayIcon from '@material-ui/icons/PlaylistPlay';
import { useLocation } from 'react-router-dom';
import { Link } from '@backstage/core-components';

const useStyles = makeStyles(theme => ({
  navRoot: {
    minWidth: 270,
    maxWidth: 290,
    borderRadius: theme.shape.borderRadius,
    paddingBottom: theme.spacing(2),
    position: 'sticky',
    top: theme.spacing(10),
    alignSelf: 'flex-start',
  },
  groupHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1.5, 2, 0.5),
    color: theme.palette.text.secondary,
  },
  navItem: {
    borderRadius: theme.shape.borderRadius,
    margin: theme.spacing(0.25, 1),
  },
  activeItem: {
    backgroundColor: theme.palette.action.selected,
    '& $itemText': {
      fontWeight: 700,
    },
  },
  itemText: {},
  linkReset: {
    color: 'inherit',
    textDecoration: 'none',
  },
}));

type NavItem = {
  label: string;
  to: string;
  icon: React.ElementType;
};

type NavGroup = {
  title: string;
  icon: React.ElementType;
  items: NavItem[];
};

const groups: NavGroup[] = [
  {
    title: 'Start',
    icon: HomeIcon,
    items: [{ label: 'Home / Start', to: '/start', icon: HomeIcon }],
  },
  {
    title: 'Build & Run',
    icon: BuildIcon,
    items: [
      { label: 'Service Catalog', to: '/start/catalog', icon: ViewModuleIcon },
      { label: 'APIs', to: '/start/apis', icon: ExtensionIcon },
    ],
  },
  {
    title: 'Learn',
    icon: DescriptionIcon,
    items: [
      { label: 'Docs', to: '/start/docs', icon: LibraryBooksIcon },
      { label: 'Playlists', to: '/start/playlists', icon: PlaylistPlayIcon },
    ],
  },
  {
    title: 'Standards',
    icon: GavelIcon,
    items: [{ label: 'Tech Radar', to: '/start/radar', icon: GavelIcon }],
  },
  {
    title: 'Utilities',
    icon: AppsIcon,
    items: [{ label: 'Tool Box', to: '/start/toolbox', icon: AppsIcon }],
  },
];

const isActivePath = (pathname: string, itemPath: string) => {
  if (itemPath === '/start') {
    return pathname === '/start';
  }
  return pathname.startsWith(itemPath);
};

export const Navigation = () => {
  const classes = useStyles();
  const location = useLocation();

  return (
    <Paper className={classes.navRoot} elevation={1} role="navigation" aria-label="Developer portal navigation">
      {groups.map((group, groupIndex) => {
        const GroupIcon = group.icon;

        return (
          <Box key={group.title}>
            <div className={classes.groupHeader}>
              <GroupIcon fontSize="small" />
              <Typography variant="caption">{group.title}</Typography>
            </div>
            <List dense disablePadding>
              {group.items.map(item => {
                const ItemIcon = item.icon;
                const active = isActivePath(location.pathname, item.to);

                return (
                  <Link key={item.to} to={item.to} className={classes.linkReset} aria-label={`Open ${item.label}`}>
                    <ListItem
                      button
                      className={`${classes.navItem} ${active ? classes.activeItem : ''}`}
                      selected={active}
                    >
                      <ListItemIcon>
                        <ItemIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{ variant: 'body2' }}
                        className={classes.itemText}
                      />
                    </ListItem>
                  </Link>
                );
              })}
            </List>
            {groupIndex < groups.length - 1 && <Divider />}
          </Box>
        );
      })}
    </Paper>
  );
};
