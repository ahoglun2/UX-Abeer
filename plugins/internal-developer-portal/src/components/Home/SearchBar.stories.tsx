import { useState } from 'react';
import { SearchBar } from './SearchBar';

export default {
  title: 'Internal Developer Portal/Home/SearchBar',
  component: SearchBar,
};

export const Default = () => {
  const [value, setValue] = useState('payments');
  return <SearchBar value={value} onChange={setValue} />;
};
