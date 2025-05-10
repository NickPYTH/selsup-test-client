import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import {AntdProvider} from "app/providers/AntdProvider";
import {Router} from "component/Router";

ReactDOM.render(
    <React.StrictMode>
        <AntdProvider>
            <Router/>
        </AntdProvider>
    </React.StrictMode>,
    document.getElementById('root')
);