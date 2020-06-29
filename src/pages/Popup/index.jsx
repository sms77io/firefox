import React from 'react';
import {render} from 'react-dom';

import Popup from './Popup';
import {General} from '../../util/General';

render(<Popup/>, document.getElementById(General.WRAPPER_ID));