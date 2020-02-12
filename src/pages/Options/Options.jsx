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

        await General.notify('Your settings have been updated.', 'Settings updated!');
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
                label='API-Key'
                name='apiKey'
                placeholder={state.apiKey}
                defaultValue={state.apiKey}
            />
            <p>
                An API key is required in order to send SMS. Get yours now at <a
                href='http://sms77.io'>sms77.io</a>.
            </p>

            <Textfield
                floatingLabel
                label='From'
                name='from'
                defaultValue={state.from}
                placeholder={state.from}
            />
            <p>
                Please notice that if you set a 'from' value you will not be asked again before sending SMS.
            </p>

            <Textfield
                floatingLabel
                label='To'
                name='to'
                defaultValue={state.to}
                placeholder={state.to}
            />
            <p>
                Please notice that if you set a 'to' value you will not be asked again before sending SMS.
            </p>

            <Textfield
                floatingLabel
                label='Signature'
                name='signature'
                rows={3}
                defaultValue={state.signature}
                placeholder={state.signature}
            />
            <p>
                The signature gets appended to each SMS.
            </p>

            <RadioGroup name="signature_position" value="append">
                <Radio value="prepend">Prepend before text</Radio>
                <Radio value="append">Append after text</Radio>
            </RadioGroup>
        </div>

        <Button raised ripple type='submit'>
            Submit
        </Button>
    </form>;
}