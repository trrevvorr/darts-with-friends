import React from 'react';
import './App.css';
import 'typeface-roboto';
import Helmet from "react-helmet";
import Cricket from './components/cricket/Cricket';
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline, createMuiTheme } from "@material-ui/core";
import HeaderBar from "./components/general/HeaderBar";

const theme = createMuiTheme({
    palette: {
      type: "dark"
    }
  });

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Darts With Friends</title>
                    <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
                </Helmet>
                <CssBaseline />
                <HeaderBar title="Cricket" />
                <Cricket />
            </ThemeProvider>
        );
    }
}

export default App;
