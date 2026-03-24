import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    height: 30,
    display: 'flex',
    alignItems: 'center',
  },
  text: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: 0.4,
    lineHeight: 1,
  },
});

const LogoFull = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <span className={classes.text}>VOLVO</span>
    </div>
  );
};

export default LogoFull;
