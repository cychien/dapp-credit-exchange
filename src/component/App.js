import React, { Component } from 'react';
import Navbar from './Navbar';
import AddRecordForm from './AddRecordForm';
import SearchRecordForm from './SearchRecordForm';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTag: "填寫信用記錄"
        }
    }

    handleClick = (navbarItemName) => {
        this.setState({ currentTag: navbarItemName });
    }

    render() {
        let page;
        if (this.state.currentTag === "填寫信用記錄")
            page = <AddRecordForm />
        else if (this.state.currentTag === "查詢信用記錄")
            page = <SearchRecordForm />

        return (
            <div>
                <Navbar clickHandler={this.handleClick} />
                {page}
            </div>
        );
    }
}

export default App;