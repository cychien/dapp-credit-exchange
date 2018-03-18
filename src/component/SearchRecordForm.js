import React, { Component } from 'react';
import creditExchangeContract from '../../build/contracts/CreditExchange.json';
import getWeb3 from '../utils/getWeb3';

class SearchRecordForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentKind: "",
            currentIdCardNumber: "",
            kind: "checkProviders",
            idCardNumber: "",
            isInfoDisplayed: false,
            isMessageDisplayed: false,
            numCasesInInfo: 0,
            numSuccessfulCasesInInfo: 0,
            isSuccessfulInInfo: [],
            amountInInfo: []
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

    handleKindChange = (event) => {
        this.setState({
            kind: event.target.value
        });
    }
    handleIdCardNumberChange = (event) => {
        this.setState({
            idCardNumber: event.target.value
        });
    }
    search = () => {
        const contract = require('truffle-contract');
        const creditExchange = contract(creditExchangeContract);
        creditExchange.setProvider(this.state.web3.currentProvider);

        var creditExchangeInstance;
        var currentState = this.state;

        this.state.web3.eth.getAccounts((error, accounts) => {
            creditExchange.deployed().then((instance) => {
                creditExchangeInstance = instance;

                return creditExchangeInstance.getPerson.call(currentState.idCardNumber,
                    currentState.kind, { from: accounts[0] });
            }).then((result) => {

                //如果擁有該idCardNumber的人還沒有任何記錄
                if (result[0].c[0] === 0) {
                    this.setState({
                        isMessageDisplayed: true,
                        isInfoDisplayed: false
                    });
                }
                //如果有找到紀錄
                else {
                    let amountArray = [];
                    for (let i = 0; i < result[3].length; i++) {
                        amountArray[i] = result[3][i].c[0];
                    }
                    let currentKind = '';
                    if (this.state.kind === "checkProviders")
                        currentKind = "支票提供者";
                    else if (this.state.kind === "moneyProviders")
                        currentKind = "投資者";
                    return this.setState({
                        currentKind: currentKind,
                        currentIdCardNumber: this.state.idCardNumber,
                        isInfoDisplayed: true,
                        numCasesInInfo: result[0].c[0],
                        numSuccessfulCasesInInfo: result[1].c[0],
                        isSuccessfulInInfo: result[2],
                        amountInInfo: amountArray,
                        isMessageDisplayed: false
                    });
                }
            });
        })

    }

    render() {
        const infoAreaClassName = [
            this.state.isInfoDisplayed ? "" : "disappear"
        ];
        const messageClassName = [
            this.state.isMessageDisplayed ? "" : "disappear"
        ]

        let rows = [];
        for (let i = 0; i < this.state.numCasesInInfo; i++) {
            rows.push(<tr>
                <th>{i + 1}</th>
                <td>$ {this.state.amountInInfo[i]}</td>
                <td>{this.state.isSuccessfulInInfo[i] ? '成功' : '失敗'}</td>
            </tr>);
        }

        return (
            <div className="container">
                <div className="field is-horizontal" id="searchRecordForm">
                    <div className="field-body">
                        <div className="dropdown">
                            <p className="control">
                                <div className="select is-info">
                                    <select onChange={this.handleKindChange}>
                                        <option value="checkProviders">支票提供者</option>
                                        <option value="moneyProviders">投資者</option>
                                    </select>
                                </div>
                            </p>
                        </div>
                        <div className="field is-grouped">
                            <p className="control is-expanded">
                                <input type="text"
                                    className="input"
                                    placeholder="身分證字號"
                                    value={this.state.idCardNumber}
                                    onChange={this.handleIdCardNumberChange}
                                />
                            </p>
                            <p className="control">
                                <a className="button is-info" onClick={this.search}>
                                    查詢
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                <div className={infoAreaClassName.join(" ").trim()} id="infoArea">
                    <nav className="panel">
                        <p className="panel-heading">
                            綜合資訊
                        </p>
                        <div className="panel-block">
                            <div className="content">
                                <p>角色：{this.state.currentKind}</p>
                                <p>身分證字號：{this.state.currentIdCardNumber}</p>
                                <p>案件總數：{this.state.numCasesInInfo}</p>
                                <p>成功案件數：{this.state.numSuccessfulCasesInInfo}</p>
                                <p>成功率：{Math.round(this.state.numSuccessfulCasesInInfo / this.state.numCasesInInfo * 100) / 100}</p>
                            </div>
                        </div>
                    </nav>
                    <div id="record">
                        <p className="is-size-4">歷史資料</p>
                        <table className="table is-hoverable is-fullwidth">
                            <tbody>
                                {rows}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={messageClassName.join(" ").trim()} id="infoArea">
                    <article className="message is-warning cannot-find-message">
                        <div className="message-header">
                            <p>訊息</p>
                        </div>
                        <div className="message-body">
                            抱歉，查無此使用者的紀錄！
                    </div>
                    </article>
                </div>
            </div>
        );
    }
}

export default SearchRecordForm;