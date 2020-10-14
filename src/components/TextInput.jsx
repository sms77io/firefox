import {Textfield} from 'react-mdl';
import React from 'react';

export default ({helpText, label, ...props}) => <>
    <Textfield
        floatingLabel
        label={browser.i18n.getMessage(label)}
        {...props}
    />

    <p>{browser.i18n.getMessage(helpText)}</p>
</>
