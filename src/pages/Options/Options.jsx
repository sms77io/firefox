import 'material-design-lite/material.min';
import React, {useEffect, useState} from 'react';
import {Button} from 'react-mdl';
import {General} from '../../util/General';
import Settings from '../../util/Settings';
import TextInput from '../../components/TextInput';
import Select from '../../components/Select';

export default () => {
    const [state, setState] = useState(Settings.defaults);

    const handleSubmit = async e => {
        e.preventDefault();

        const opts = Object.keys(state)
            .map(k => ({[k]: e.target.elements.namedItem(k).value}));

        setState(await Settings.setObject(Object.assign(...opts)));

        await General.notify('settings_updated', 'settings_updated_title');
    };

    useEffect(() => {
        Settings.getAll()
            .then(s => setState(s));
    }, []);

    return <form onSubmit={handleSubmit} style={{padding: '15px'}}>
        <h1>Sms77io API {browser.i18n.getMessage('options')}</h1>

        <div style={{display: 'flex', 'flexDirection': 'column'}}>
            <TextInput
                defaultValue={state.apiKey}
                helpText='api_key_info'
                label='api_key'
                name='apiKey'
            />

            <TextInput
                defaultValue={state.from}
                helpText='from_info'
                label='from'
                name='from'
            />

            <TextInput
                defaultValue={state.to}
                helpText='to_info'
                label='to'
                name='to'
            />

            <TextInput
                defaultValue={state.signature}
                helpText='signature_label'
                label='signature'
                name='signature'
                rows={3}
            />

            <Select selected={state.signaturePosition} label='signaturePosition'
                    name='signaturePosition' options={{
                signature_position_prepend: 'prepend',
                signature_position_append: 'append',
            }}/>
        </div>

        <Button raised ripple type='submit'>
            {browser.i18n.getMessage('submit')}
        </Button>
    </form>;
}