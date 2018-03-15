import React, { Component } from 'react';
import AddRecordLine from './AddRecordLine';
import creditExchangeContract from '../../build/contracts/CreditExchange.json';
import getWeb3 from '../utils/getWeb3';

class AddRecordForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            web3: null,
            caseIndex: 0,
            records: [
                {
                    id: 0,
                    kind: "checkProviders",
                    idCardNumber: "",
                    amount: 0,
                    isSuccessful: null
                }
            ]
        }
    }

    componentWillMount() {
        getWeb3
            .then(result => {
                this.setState({
                    web3: result.web3
                });
            })
            .catch(() => {
                console.log('Error finding web3.')
            })
    }

    handleKindChange = (id, value) => {
        let currentUpdate = this.state.records;
        currentUpdate[id].kind = value;
        this.setState({
            records: currentUpdate
        });
    }
    handleIdCardNumberChange = (id, value) => {
        let currentUpdate = this.state.records;
        currentUpdate[id].idCardNumber = value;
        this.setState({
            records: currentUpdate
        });
    }
    handleAmountChange = (id, value) => {
        let currentUpdate = this.state.records;
        currentUpdate[id].amount = value;
        this.setState({
            records: currentUpdate
        });
    }
    handleIssuccessfulClick = (id, value) => {
        let currentUpdate = this.state.records;
        currentUpdate[id].isSuccessful = value;
        this.setState({
            records: currentUpdate
        });
    }
    addChild = () => {
        this.setState({
            totalCaseNumber: this.state.caseIndex + 1,
            records: this.state.records.concat([{
                id: this.state.caseIndex + 1,
                kind: "checkProviders",
                idCardNumber: "",
                amount: 0,
                isSuccessful: null
            }])
        });
    }
    sendRecords = () => {
        const contract = require('truffle-contract');
        const creditExchange = contract(creditExchangeContract);
        creditExchange.setProvider(this.state.web3.currentProvider);

        var creditExchangeInstance;
        var currentTime = new Date();
        var formattedTime = currentTime.getFullYear() + "/" + (currentTime.getMonth() + 1)
            + "/" + currentTime.getDate();
        var currentRecords = this.state.records;

        this.state.web3.eth.getAccounts((error, accounts) => {
            creditExchange.deployed().then((instance) => {
                creditExchangeInstance = instance;

                return (function loop(i) {
                    if (i < currentRecords.length)
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                creditExchangeInstance.newPerson(
                                    currentRecords[i].idCardNumber,
                                    currentRecords[i].kind,
                                    { from: accounts[0] }
                                ).then((result) => {
                                    creditExchangeInstance.addCase(
                                        currentRecords[i].idCardNumber,
                                        currentRecords[i].kind,
                                        currentRecords[i].isSuccessful,
                                        currentRecords[i].amount,
                                        { from: accounts[0] }
                                    );
                                }).then((result) => {
                                    resolve();
                                });
                            }, 0);
                        }).then(loop.bind(null, i + 1));
                })(0);

            }).then((result) => {
                let records = [
                    {
                        id: 0,
                        kind: "checkProviders",
                        idCardNumber: "",
                        amount: 0,
                        isSuccessful: null
                    }
                ];
                return this.setState({ records: records, caseIndex: 0 });
            });
        });
    }

    render() {
        return (
            <div className="container">
                <div id="addRecordForm">
                    {
                        this.state.records.map((item) => (
                            <AddRecordLine
                                key={item.id}
                                id={item.id}
                                kind={item.kind}
                                idCardNumber={item.idCardNumber}
                                amount={item.amount}
                                isSuccessful={item.isSuccessful}
                                kindChangeHandler={this.handleKindChange}
                                idCardNumberChangeHandler={this.handleIdCardNumberChange}
                                amountChangeHandler={this.handleAmountChange}
                                isSuccessfulClickHandler={this.handleIssuccessfulClick}
                            />
                        ))
                    }
                </div>
                <div onClick={this.addChild}>
                    新增一筆記錄
                </div>
                <button onClick={this.sendRecords}>送出</button>
            </div>
        );
    }
}

export default AddRecordForm;