import React, { Component } from 'react';

class AddRecordLine extends Component {
    handleKindChange = (event) => {
        this.props.kindChangeHandler(this.props.id, event.target.value);
    }
    handleIdCardNumberChange = (event) => {
        this.props.idCardNumberChangeHandler(this.props.id, event.target.value);
    }
    handleAmountChange = (event) => {
        this.props.amountChangeHandler(this.props.id, event.target.value);
    }
    handleIssuccessfulClick = (event) => {
        let result;
        if (event.target.innerHTML === "成功")
            result = true;
        else if (event.target.innerHTML === "失敗")
            result = false;
        this.props.isSuccessfulClickHandler(this.props.id, result);
    }
    handleDeleteClick = () => {
        this.props.deleteClickHandler(this.props.id);
    }

    render() {
        //根據當前isSuccessful的值決定button的外觀
        const successButton = [
            "button",
            "is-success",
            this.props.isSuccessful === null ? "is-outlined" : this.props.isSuccessful ? "" : "is-outlined"
        ]
        const failButton = [
            "button",
            "is-warning",
            this.props.isSuccessful === null ? "is-outlined" : this.props.isSuccessful ? "is-outlined" : ""
        ]

        //如果是第0個(id === 0)就不顯示delete-icon
        const deleteButton = [
            "button",
            "is-danger",
            "delete-button",
            this.props.id === 0 ? "invisible" : ""
        ];

        return (
            <div className="field is-horizontal">
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
                    <div className="field">
                        <p className="control is-expanded">
                            <input type="text" className="input"
                                placeholder="身分證字號"
                                value={this.props.idCardNumber}
                                onChange={this.handleIdCardNumberChange}
                            />
                        </p>
                    </div>
                    <div className="field">
                        <p className="control is-expanded">
                            <input type="text" className="input"
                                placeholder="金額"
                                value={this.props.amount}
                                onChange={this.handleAmountChange}
                            />
                        </p>
                    </div>
                    <div className="btn">
                        <p className="control">
                            <a className={successButton.join(" ").trim()} onClick={this.handleIssuccessfulClick}>
                                成功
                            </a>
                        </p>
                    </div>
                    <div className="btn">
                        <p className="control">
                            <a className={failButton.join(" ").trim()} onClick={this.handleIssuccessfulClick}>
                                失敗
                            </a>
                        </p>
                    </div>

                    <div className="btn">
                        <p className="control">
                            <a className={deleteButton.join(" ").trim()} onClick={this.handleDeleteClick}>
                                <span className="icon is-medium">
                                    <i className="fas fa-times"></i>
                                </span>
                            </a>
                        </p>
                    </div>

                </div>
            </div>
        );
    }
}

export default AddRecordLine;