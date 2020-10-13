import 'material-design-lite/material.min';
import React, {useEffect, useState} from 'react';
import {Button, Radio, RadioGroup, Textfield} from 'react-mdl';

import {General} from '../../util/General';
import {Settings} from '../../util/Settings';

export default () => {
    const [state, setState] = useState({...Settings.object});

    const handleSubmit = async ev => {
        ev.preventDefault();

        const settings = Object.assign(
            ...Object.keys(state)
                .map(k => ({[k]: ev.target.elements.namedItem(k).value}))
        );

        setState(await Settings.setObject(settings));

        await General.notify(browser.i18n.getMessage('settings_updated'), browser.i18n.getMessage('settings_updated_title'));
    };

    useEffect(() => {
        Settings.getAll()
            .then(s => setState(s));
    }, []);

    return <form onSubmit={handleSubmit} style={{padding: '15px'}}>
        <h1>Sms77io API Options</h1>

        <div style={{display: 'flex', 'flexDirection': 'column'}}>
            <Textfield
                floatingLabel
                label={browser.i18n.getMessage('api_key')}
                name='apiKey'
                placeholder={state.apiKey}
                defaultValue={state.apiKey}
            />
            <p>
                {browser.i18n.getMessage('api_key_required')}. {browser.i18n.getMessage('api_key_get')}
                <a href='http://sms77.io'>sms77.io</a>.
            </p>

            <Textfield
                floatingLabel
                label={browser.i18n.getMessage('from')}
                name='from'
                defaultValue={state.from}
                placeholder={state.from}
            />
            <p>
                {browser.i18n.getMessage('from_info')}
            </p>

            <Textfield
                floatingLabel
                label={browser.i18n.getMessage('to')}
                name='to'
                defaultValue={state.to}
                placeholder={state.to}
            />
            <p>
                {browser.i18n.getMessage('from_info')}
            </p>

            <Textfield
                floatingLabel
                label={browser.i18n.getMessage('signature')}
                name='signature'
                rows={3}
                defaultValue={state.signature}
                placeholder={state.signature}
            />
            <p>
                {browser.i18n.getMessage('signature_label')}
            </p>

            <RadioGroup name='signature_position' value='append'>
                <Radio
                    value='prepend'>{browser.i18n.getMessage('signature_position_prepend')}</Radio>
                <Radio value='append'>{browser.i18n.getMessage('signature_position_append')}</Radio>
            </RadioGroup>
        </div>

        <Button raised ripple type='submit'>
            {browser.i18n.getMessage('submit')}
        </Button>
    </form>;
}