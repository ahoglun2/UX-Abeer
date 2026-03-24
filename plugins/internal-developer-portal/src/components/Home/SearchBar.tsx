import {
  Box,
  Chip,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  makeStyles,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
  },
  chips: {
    display: 'flex',
    gap: theme.spacing(1),
    flexWrap: 'wrap',
    marginTop: theme.spacing(1),
  },
}));

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  const classes = useStyles();

  return (
    <Paper className={classes.root} role="search" aria-label="Global portal search">
      <Typography variant="h6">Find anything in one place</Typography>
      <Typography variant="body2" color="textSecondary">
        Search across catalog entities, APIs, docs, and tools.
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        margin="normal"
        placeholder="Try: payments API, on-call ownership, service template"
        value={value}
        onChange={event => onChange(event.target.value)}
        inputProps={{ 'aria-label': 'Global search input' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Box className={classes.chips}>
        {['Catalog', 'APIs', 'Docs', 'Tools'].map(scope => (
          <Chip key={scope} label={scope} size="small" aria-label={`Search scope ${scope}`} />
        ))}
      </Box>
    </Paper>
  );
};
