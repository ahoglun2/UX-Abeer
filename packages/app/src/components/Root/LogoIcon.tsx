import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  badge: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    border: '2px solid #ffffff',
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 700,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    letterSpacing: 0.2,
  },
});

const LogoIcon = () => {
  const classes = useStyles();

  return <span className={classes.badge}>V</span>;
};

export default LogoIcon;
