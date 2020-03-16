import React from 'react';
import './App.css';
import 'typeface-roboto';
import Button from '@material-ui/core/Button';
import Helmet from "react-helmet";

function App() {
  return (
    <div className="application">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Darts With Friends</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Helmet>
      <Button variant="contained" color="primary">
        Hello World
      </Button>
    </div>
  );
}

export default App;
