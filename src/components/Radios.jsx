import {Radio, RadioGroup} from 'react-mdl';
import React from 'react';

export default ({values, ...props}) => <RadioGroup {...props}>
    {Object.entries(values).map(([k, v]) => <Radio
        value={v}>{browser.i18n.getMessage(k)}</Radio>)}
</RadioGroup>