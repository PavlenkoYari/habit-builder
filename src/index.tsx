import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router";
import Routes from './components/Routes'

import './theme.scss';
import './index.scss';


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <BrowserRouter basename="/habit-builder">
        <Routes/>
    </BrowserRouter>
);

