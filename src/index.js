import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter,Route, Switch} from 'react-router-dom';
import 'antd/dist/antd.css';

import HomePage from './component/layout/chart';

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route path="/" exact component={HomePage}/>
        </Switch>

    </BrowserRouter>
    ,document.getElementById('root'));

serviceWorker.unregister();
