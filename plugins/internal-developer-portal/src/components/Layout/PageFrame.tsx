import React, { PropsWithChildren, useMemo, useState } from 'react';
import {
  Box,
  Breadcrumbs,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  makeStyles,
} from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { Content, Header, Link, Page } from '@backstage/core-components';

const useStyles = makeStyles(theme => ({
  breadcrumbWrap: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
}));

type Crumb = {
  label: string;
  to?: string;
};

type PageFrameProps = PropsWithChildren<{
  title: string;
  subtitle: string;
  breadcrumbs: Crumb[];
  topLeftContent?: React.ReactNode;
}>;

export const PageFrame = ({ title, subtitle, breadcrumbs, topLeftContent, children }: PageFrameProps) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const helpLinks = useMemo(
    () => [
      { label: 'How to use Backstage', to: '/docs' },
      { label: 'Frequently Asked Questions', to: '/docs' },
      { label: 'Contact Platform Team', to: '/catalog?filters[kind]=group' },
    ],
    [],
  );

  return (
    <Page themeId="home">
      <Header title={title} subtitle={subtitle} />
      <Content>
        <div className={classes.breadcrumbWrap}>
          {topLeftContent ?? (
            <Breadcrumbs aria-label="breadcrumbs">
              {breadcrumbs.map((crumb, index) =>
                crumb.to ? (
                  <Link key={`${crumb.label}-${index}`} to={crumb.to}>
                    {crumb.label}
                  </Link>
                ) : (
                  <Typography key={`${crumb.label}-${index}`} color="textPrimary" variant="body2">
                    {crumb.label}
                  </Typography>
                ),
              )}
            </Breadcrumbs>
          )}

          <Box>
            <IconButton
              aria-label="Help menu"
              aria-controls="help-menu"
              aria-haspopup="true"
              onClick={event => setAnchorEl(event.currentTarget)}
            >
              <HelpOutlineIcon />
            </IconButton>
            <Menu
              id="help-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              {helpLinks.map(help => (
                <MenuItem
                  key={help.label}
                  onClick={() => setAnchorEl(null)}
                  component={Link as React.ElementType}
                  to={help.to}
                >
                  {help.label}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </div>

        <main>{children}</main>
      </Content>
    </Page>
  );
};
