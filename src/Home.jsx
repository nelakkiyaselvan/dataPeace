import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import { dataJson } from './users';
import hamburgerLogo from './img/menu-icon.png';
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { isLoaded: false, isFromSearch: false, success: true, response: [], searchResults: [], startFrom: props.startFrom, endFrom: props.endFrom }
        this.handlePrevNext = this.handlePrevNext.bind(this)
        this.getTableData = this.getTableData.bind(this)
        this.renderPagination = this.renderPagination.bind(this)
        console.log("cosn", props)
    }
    triggerPagination = (e) => {
        let pageId = e.target.getAttribute("pageIdx");
        pageId *= 5;

        this.setState({ startFrom: pageId, endFrom: pageId + 5 });
    }
    renderPagination(startFrm) {
        let isFromSearch = this.state.isFromSearch;
        let searchResultLen = this.state.searchResults.length;
        let responseLength = (isFromSearch) ? searchResultLen : this.state.responseLength;
        let pageLength = parseInt(responseLength / 5);
        let enablePrev = "disabled";
        let enableNext = "disabled";
        let enablePageNext = "disabled";
        let enablePagePrev = "disabled";
        let pagePrevNext = "";

        if (pageLength || responseLength) {
            let pageId = 0;
            let endFrm = this.state.endFrom;
            enablePrev = (endFrm > 5) ? "enabled" : "disabled";
            enableNext = (endFrm < responseLength) ? "enabled" : "disabled";
            enablePagePrev = ((endFrm / 5) > 9) ? "enabled" : "disabled";
            let btns = [];
            let selectedPage = "";
            let curPage = (startFrm / 5);
            pageId = (startFrm >= 45) ? (curPage - (curPage % 9)) + 1 : 1;
            curPage += 1;
            enablePageNext = (pageLength > curPage) ? "enabled" : "disabled";

            for (var i = 0; i < 9; i++) {
                selectedPage = "";
                //if((pageId == curPage) || (i == 0 && startFrm == 0)) {
                if (pageId == curPage) {
                    selectedPage = "selected";
                }
                btns.push(<button class={`page${pageId} paginBtn ${selectedPage}`} onClick={this.getPageData}>{pageId}</button>)
                pageId += 1;
                if (endFrm >= responseLength)
                    break;
            }

            pagePrevNext = (
                <div class="paginationList">
                    <button class={`pagePrev paginBtn ${enablePagePrev}`} onClick={this.triggerPagination} pageIdx={pageId - 11}>&lt;&lt;</button>
                    {btns}
                    <button class={`pageNext paginBtn ${enablePageNext}`} onClick={this.triggerPagination} pageIdx={pageId - 1}>&gt;&gt;</button>
                </div>
            );
        }
        let paginDom = (<div class="paginationCont">
            <div class="cls_prevNext">
                <button class={`clsPrev btnPrevNext ${enablePrev}`} onClick={this.handlePrevNext.bind(this)}>Previous</button>
                <button class={`clsNext btnPrevNext ${enableNext}`} onClick={this.handlePrevNext.bind(this)}>Next</button>
            </div>
            {pagePrevNext}
        </div>
        );
        return paginDom
    }
    getPageData = (e) => {
        let selectedList = e.target.parentNode.getElementsByClassName('selected');
        if (selectedList.length)
            selectedList[0].classList.remove('selected');
        let pageNo = parseInt(e.target.textContent) - 1;
        e.target.classList.add("selected");
        pageNo *= 5;

        this.setState({ startFrom: pageNo, endFrom: pageNo + 5 });
    }
    handlePrevNext(e) {
        let action = e.target.className;
        let topEle = e.target.parentElement.parentElement.previousElementSibling;
        let startIdx = parseInt(topEle.getAttribute("startIdx"));
        let endIdx = parseInt(topEle.getAttribute("endIdx"));
        if (action.indexOf("clsPrev") != -1 && startIdx > 0) {
            this.setState({ startFrom: startIdx - 5, endFrom: endIdx - 5 })
        }
        else if (action.indexOf("clsNext") != -1 && this.state.responseLength > endIdx) {
            this.setState({ startFrom: startIdx + 5, endFrom: endIdx + 5 })
        }
    }
    getSortList = (e) => {
        let sortBy = e.currentTarget.getAttribute("label");
        let sorted = e.currentTarget.classList.contains("sorted");
        let sortedList = e.target.parentNode.getElementsByClassName('sorted');
        if (sortedList.length)
            sortedList[0].classList.remove('sorted');
        let tableData = (this.state.curTableData || []);
        if (sorted) {
            tableData.sort((a, b) => (b[sortBy] > a[sortBy]) ? 1 : ((a[sortBy] > b[sortBy]) ? -1 : 0));
            e.currentTarget.classList.remove("sorted");
        } else {
            tableData.sort((a, b) => (a[sortBy] > b[sortBy]) ? 1 : ((b[sortBy] > a[sortBy]) ? -1 : 0));
            e.currentTarget.classList.add("sorted");
        }

        this.setState({ isFromSort: true, curTableData: tableData });
    }
    setUseData = (data, props) => {
        props.setUserData(data, this.state.startFrom, this.state.endFrom);
        props.history.push(`/user/${data.id}`)
    }
    getTableData(start, end, props) {
        let dataObj = [];
        if (this.state.isFromSearch) {
            dataObj = Object.assign([], this.state.searchResults);
            dataObj = dataObj.splice(start, end);
        } else if (this.state.isFromSort) {
            dataObj = this.state.curTableData;
            this.state.isFromSort = false;
        } else {
            dataObj = (this.state && this.state.response) ? Object.assign([], this.state.response) : [];
            dataObj = dataObj.splice(start, end);
            this.state.curTableData = dataObj;
        }

        dataObj = dataObj.map((data, idx) =>
            <tr id={data.id} onClick={(event) => { this.setUseData(data, props) }}>
                {/* <Link to={`/user/${data.id}`} > */}
                <td value={data.first_name}>{data.first_name}</td>
                <td value={data.last_name}>{data.last_name}</td>
                <td value={data.company_name}>{data.company_name}</td>
                <td value={data.city}>{data.city}</td>
                <td value={data.state}>{data.state}</td>
                <td value={data.zip}>{data.zip}</td>
                <td value={data.email}>{data.email}</td>
                <td value={data.web}>{data.web}</td>
                <td value={data.age}>{data.age}</td>
                {/* </Link> */}
            </tr>
        );
        return (
            dataObj
        )
    }
    searchByName = (fName) => {
        let userList = this.state.response;
        let searchResults = [];
        searchResults = userList.filter((data) => {
            return data.first_name.toLowerCase() == fName.toLowerCase()
        })
        console.log("Res",searchResults)
        this.setState({searchResults: searchResults, startFrom: 0, isFromSearch : true})
    }
    handleChange = (e) => {
        let ele = e.target.nextElementSibling;
        let isVisible = e.target.nextElementSibling.hidden;
        if(!isVisible && e.target.value.trim().length) {
            ele.classList.add('true');
            ele.classList.remove('false');
        } else {
            ele.classList.remove('true');
            ele.classList.add('false');
        }
    }
    removeSearch = (e) => {
        let curEle = e.currentTarget;
        curEle.previousElementSibling.value = "";
        curEle.classList.add('false');
        curEle.classList.remove('true');
        
        this.setState({isFromSearch : false})
    }
    makeTableJSON = () => {
        fetch("http://demo9197058.mockable.io/users")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        response: result,
                        responseLength: result.length,
                        success: true
                    });
                },
                (error) => {
                    //   this.setState({
                    //     isLoaded: true,
                    //     success: false
                    //   });
                    this.setState({
                        isLoaded: true,
                        response: dataJson,
                        responseLength: dataJson.length,
                        success: true
                    });
                }
            )
    }
    renderTable = (props) => {
        if (this.state.response.length) {
            let startFrm = this.state.startFrom;
            const row = this.getTableData(startFrm, 5, props);
            const paginDom = this.renderPagination(startFrm);
            const dropIcon = (<span class="dropIcon"></span>);
            return (
                <div>
                    <div class="header"><div class="headerIcon"><img src={hamburgerLogo}/></div><div class="headerText">data peace</div></div>
                    <div class="searchCont">
                        <input class="searchBox" onKeyDown={(event) => { if (event.key === 'Enter') { this.searchByName(event.target.value.trim()) } }} onChange={this.handleChange} placeholder="Search by first name" maxlength="30"></input>
                        <button class={`removeSearch paginBtn ${this.state.isFromSearch}`} onClick={this.removeSearch}>Clear</button>
                    </div>
                    <div className="userTable" startIdx={this.state.startFrom} endIdx={this.state.endFrom}>
                        <table>
                            <tbody>
                                <tr>
                                    <th onClick={this.getSortList} label="first_name">{dropIcon}first name</th>
                                    <th onClick={this.getSortList} label="last_name">{dropIcon}last name</th>
                                    <th onClick={this.getSortList} label="company_name">{dropIcon}company name</th>
                                    <th onClick={this.getSortList} label="city">{dropIcon}city</th>
                                    <th onClick={this.getSortList} label="state">{dropIcon}state</th>
                                    <th onClick={this.getSortList} label="zip">{dropIcon}zip</th>
                                    <th onClick={this.getSortList} label="email">{dropIcon}email</th>
                                    <th onClick={this.getSortList} label="web">{dropIcon}web</th>
                                    <th onClick={this.getSortList} label="age">{dropIcon}age</th>
                                </tr>
                                {row}
                            </tbody>
                        </table>
                    </div>
                    {paginDom}
                </div>
            );
        } else if (this.state.isLoaded == false) {
            this.makeTableJSON();
        } else {
            return (
                <div class="noDataFnd">No data found...</div>
            );
        }
    }
    render() {
        console.log("props ", this.props)
        return (
            <React.Fragment>{this.renderTable(this.props)}</React.Fragment>
        );
    }
}

export default Home;