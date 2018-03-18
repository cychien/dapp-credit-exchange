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

    //找尋該id的index
    findIndex = (id) => {
        for (let i = 0; i < this.state.records.length; i++) {
            let record = this.state.records[i];
            if (record.id === id)
                return i;
        }
    }

    handleKindChange = (id, value) => {
        let currentUpdate = this.state.records;
        let index = this.findIndex(id);
        currentUpdate[index].kind = value;
        this.setState({
            records: currentUpdate
        });
    }
    handleIdCardNumberChange = (id, value) => {
        let currentUpdate = this.state.records;
        let index = this.findIndex(id);
        currentUpdate[index].idCardNumber = value;
        this.setState({
            records: currentUpdate
        });
    }
    handleAmountChange = (id, value) => {
        let currentUpdate = this.state.records;
        let index = this.findIndex(id);
        currentUpdate[index].amount = value;
        this.setState({
            records: currentUpdate
        });
    }
    handleIssuccessfulClick = (id, value) => {
        let currentUpdate = this.state.records;
        let index = this.findIndex(id);
        currentUpdate[index].isSuccessful = value;
        this.setState({
            records: currentUpdate
        });
    }
    handleDeleteClick = (id) => {
        let currentUpdate = this.state.records;
        let index = this.findIndex(id);
        currentUpdate.splice(index, 1)
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
            }]),
            caseIndex: this.state.caseIndex + 1
        });
    }
    sendRecords = () => {
        const contract = require('truffle-contract');
        const creditExchange = contract(creditExchangeContract);
        creditExchange.setProvider(this.state.web3.currentProvider);

        var creditExchangeInstance;
        var currentRecords = this.state.records;

        this.state.web3.eth.getAccounts((error, accounts) => {
            //取得合約instance
            creditExchange.deployed().then((instance) => {
                creditExchangeInstance = instance;

                //使loop變成同步執行
                return (function loop(i) {
                    if (i < currentRecords.length)
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                creditExchangeInstance.addCase(
                                    currentRecords[i].idCardNumber,
                                    currentRecords[i].kind,
                                    currentRecords[i].isSuccessful,
                                    currentRecords[i].amount,
                                    { from: accounts[0] }
                                )
                                    .then((result) => {
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
        //檢查是否有非法的輸入(空值或amount欄位為0)
        let isSendDisabled = false;
        for (let i = 0; i < this.state.records.length; i++) {
            let record = this.state.records[i];
            if (record.idCardNumber === '' ||
                Number.isInteger(Number(record.amount)) === false ||
                Number(record.amount) === 0 ||
                record.isSuccessful === null)
                isSendDisabled = true;
        }
        //依照isSendDisabled的值決定要用哪一種button
        let sendButton;
        if (isSendDisabled)
            sendButton = (
                <a className="button disabled-button" disabled>送出</a>
            );
        else
            sendButton = (
                <a className="button is-link" onClick={this.sendRecords}>送出</a>
            );

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
                                deleteClickHandler={this.handleDeleteClick}
                            />
                        ))
                    }
                </div>
                <div className="add-record" onClick={this.addChild}>
                    新增記錄...
                </div>
                {sendButton}
            </div>
        );
    }
}

export default AddRecordForm;