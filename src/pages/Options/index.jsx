import React from 'react';
import {render} from 'react-dom';

import Options from './Options';
import {General} from '../../util/General';

render(<Options/>, document.getElementById(General.WRAPPER_ID));