import React, {Component} from 'react';
import {Button, Textfield} from 'react-mdl';
import 'material-design-lite/material.min';

import {General} from '../../util/General';
import {Storage} from '../../util/Storage';

export default class Options extends Component {
    constructor(props) {
        super(props);

        this.state = {
            apiKey: '',
            to: '',
            from: '',
            signature: '',
        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    async onSubmit(ev) {
        ev.preventDefault();

        Object.keys(this.state).forEach(key => this.setState(Storage.setByKey(key, ev.target[key].value)));

        window.close();

        await General.notify('Your settings have been updated.', 'Settings updated!');
    }

    async componentDidMount() {
        this.setState({
            apiKey: await Storage.getByKey(Storage.keys.apiKey),
            from: await Storage.getByKey(Storage.keys.from),
            signature: await Storage.getByKey(Storage.keys.signature),
            to: await Storage.getByKey(Storage.keys.to),
        });
    }

    render() {
        return <div>
            <h1>Sms77io API Options</h1>

            <form onSubmit={this.onSubmit}>
                <div style={{display: 'flex', 'flexDirection': 'column'}}>
                    <Textfield
                        floatingLabel
                        label='API-Key'
                        name='apiKey'
                        placeholder={this.state.apiKey}
                        defaultValue={this.state.apiKey}
                    />
                    <p>
                        An API key is required in order to send SMS. Get yours now at <a
                        href='http://sms77.io'>sms77.io</a>.
                    </p>

                    <Textfield
                        floatingLabel
                        label='From'
                        name='from'
                        defaultValue={this.state.from}
                        placeholder={this.state.from}
                    />
                    <p>
                        Please notice that if you set a 'from' value you will not be asked again before sending SMS.
                    </p>

                    <Textfield
                        floatingLabel
                        label='To'
                        name='to'
                        defaultValue={this.state.to}
                        placeholder={this.state.to}
                    />
                    <p>
                        Please notice that if you set a 'to' value you will not be asked again before sending SMS.
                    </p>

                    <Textfield
                        floatingLabel
                        label='Signature'
                        name='signature'
                        rows={3}
                        defaultValue={this.state.signature}
                        placeholder={this.state.signature}
                    />
                    <p>
                        The signature gets appended to each SMS.
                    </p>
                </div>

                <Button raised ripple type='submit'>
                    Submit
                </Button>
            </form>
        </div>;
    }
}