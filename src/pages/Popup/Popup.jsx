import React, {Component} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Textfield} from 'react-mdl';
import 'material-design-lite/material.min';
import logo from '../../assets/img/logo.svg';
import {Sms} from '../../util/Sms';
import {General} from '../../util/General';

export default class Popup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            text: '',
            to: '',
            from: '',
        };

        this.container = document.getElementById('app-container');

        this.handleOpenDialog = this.handleOpenDialog.bind(this);
        this.handleCloseDialog = this.handleCloseDialog.bind(this);
        this.handleOnSend = this.handleOnSend.bind(this);
    }

    _setContainerStyle(prop, value) {
        this.container.style[prop] = value;
    }

    handleOpenDialog() {
        this._setContainerStyle('width', '300px');
        this._setContainerStyle('height', '500px');
        this.setState({openDialog: true});
    }

    handleCloseDialog() {
        this.setState({openDialog: false});
        this._setContainerStyle('width', 'auto');
        this._setContainerStyle('height', '151px');
    }

    async handleOnSend() {
        await Sms.send(...Object.values(this.state));

        this.handleCloseDialog();
    }

    handleOptions() {
        chrome.runtime.openOptionsPage
            ? chrome.runtime.openOptionsPage()
            : window.open(chrome.runtime.getURL('options.html'));
    }

    async componentDidMount() {
        this.setState({
            from: await General.getLocalStoreByKey('from'),
            to: await General.getLocalStoreByKey('to'),
        });
    }

    render() {
        return (
            <div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column'
                    }}
                >
                    <img src={logo} alt="extension icon"
                         style={{marginBottom: '15px', maxWidth: '150px', marginTop: '15px'}}/>

                    <Button style={{marginBottom: '10px'}} onClick={this.handleOptions} raised colored
                            ripple>Options</Button>

                    <Button style={{marginBottom: '10px'}} onClick={this.handleOpenDialog} raised ripple>Send
                        SMS</Button>
                </div>

                <Dialog open={this.state.openDialog} onCancel={this.handleCloseDialog}>
                    <DialogTitle>What would you like to send?</DialogTitle>

                    <DialogContent>
                        <Textfield
                            label="Message content"
                            rows={3}
                            value={this.state.text}
                            onChange={ev => this.setState({text: ev.target.value})}
                            placeholder="Enter message content here."
                        />

                        <Textfield
                            floatingLabel
                            label='From'
                            name='from'
                            onChange={ev => this.setState({from: ev.target.value})}
                            defaultValue={this.state.from}
                            placeholder={this.state.from}
                        />

                        <Textfield
                            floatingLabel
                            label='To'
                            name='to'
                            onChange={ev => this.setState({to: ev.target.value})}
                            defaultValue={this.state.to}
                            placeholder={this.state.to}
                        />
                    </DialogContent>

                    <DialogActions fullWidth>
                        <Button type='button' onClick={this.handleOnSend}>Send</Button>

                        <Button type='button' onClick={this.handleCloseDialog}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}