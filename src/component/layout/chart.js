import React, { Component } from 'react';
import { find, filter, groupBy } from 'lodash';
import {  Table, Row, Col } from 'antd';
import './home.css';
import { Chart } from "react-google-charts";


const resultColor = {
    Excellent: {color: 'green'},
    Good: {color: 'blue'},
    OK: {color: 'red'},
};

class Home extends Component{

    constructor(props) {
        super(props);
        let data = require('../../data');
        let empData = data.data;
        empData.map(obj=>{
            obj.joinigYear = new Date(obj.createdDate).getFullYear();
            obj.collageKeyword = obj.College.searchKeyword;
            return obj;
        });
        this.state={
            empData,
            yearChart: null,
            listData: null,
            resultChart: null,
            resultData: null,
            selectedCollege: null,
            chartColors: null
        };
    }

    componentDidMount() {
        this.yearWiseChart();
        this.columns = [
            {
                title: 'Employee ID',
                dataIndex: 'userId',
                key: 'userId',
            },
            {
                title: 'First Name',
                dataIndex: 'firstName',
                key: 'firstName',
            },
            {
                title: 'Last Name',
                dataIndex: 'lastName',
                key: 'lastName',
            }, {
                title: 'Result',
                dataIndex: 'result',
                key: 'result',
            },
        ];
    }

    yearWiseChart = () => {
        const { empData } = this.state;
        let yearWiseData = groupBy(empData,'joinigYear');
        let allColleges = Object.keys(groupBy(empData,'collageKeyword'));
        let finalData = Object.keys(yearWiseData).map(x=> { return { year:x, data: groupBy(yearWiseData[x],'collageKeyword') }});
        const chartType = 'Year';
        let yearChart = [];
        yearChart.push([chartType, ...allColleges]);
        Object.keys(yearWiseData).map(year => {
            let data = find(finalData, { year: year });
            let row = [];
            yearChart[0].map(col => {
                if(col === chartType){
                    row = [year];
                }else{
                    if(col in data.data){
                        row = [...row, data.data[col].length];
                    }else{
                        row = [...row, 0];
                    }
                }
            });
            yearChart.push(row);
        });
        this.setState({
            yearChart
        });

        this.chartEvents = [
            {
                eventName: "select",
                callback: ({ chartWrapper }) => {
                    this.showTable(chartWrapper);
                }
            }
        ]
    };

    showTable = (chartWrapper) => {
        const { yearChart, empData } = this.state;
        let obj = chartWrapper.getChart().getSelection();
        const college = yearChart[0][obj[0].column];
        const year = parseInt(yearChart[obj[0].row+1][0]);
        let listData = filter(empData, { joinigYear: year, collageKeyword: college });
        this.setResultChart(listData);
        let selectedCollege = null;
        if(listData.length > 0){
            selectedCollege = listData[0].College;
        }
        this.setState({
            listData,
            selectedCollege
        });
    };

    setResultChart = (listData) => {
        let resultChart = [];
        resultChart.push(['Task', 'Result']);
        const groupData = groupBy(listData,'result');

        let chartColors = [];

        Object.keys(groupData).map((resultType, index) => {
            resultChart.push([resultType, groupData[resultType].length]);
            chartColors.push(resultColor[resultType]);
        });
        this.setState({
            resultChart,
            chartColors
        });

        console.log(chartColors);

        this.pieChartEvents = [
            {
                eventName: "select",
                callback: ({ chartWrapper }) => {
                    this.showResultTable(chartWrapper);
                }
            }
        ]
    };

    showResultTable = (chartWrapper) => {
        const { resultChart, listData } = this.state;
        let obj = chartWrapper.getChart().getSelection();
        const result = resultChart[obj[0].row+1][0];
        let resultData = filter(listData, { result });
        this.setState({
            resultData
        });
    };

    render() {
        const { yearChart, listData, resultChart,
            resultData, selectedCollege, chartColors } = this.state;
        return(
            <div style={{ marginTop:'1%' }}>
                <Row>
                    <Col span={7}/>
                    <Col span={10}>
                        {
                            yearChart &&
                            <Chart
                                width={'800px'}
                                height={'500px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={yearChart}
                                options={{
                                    chart: {
                                        title: 'Employee',
                                        subtitle: 'Year wise employees',
                                    },
                                }}
                                chartEvents={this.chartEvents}
                                rootProps={{ 'data-testid': '2' }}
                            />
                        }
                    </Col>
                    <Col span={7}/>
                </Row>
                <Row>
                    <Col span={2}/>
                    <Col span={20}>
                        {
                            selectedCollege &&
                            <div style={{backgroundColor:'#fafafa', paddingTop: '2%', paddingBottom:'2%' }}>
                                <h3 style={{textAlign:'center'}}>
                                    {selectedCollege.collegeName || ''}
                                </h3>
                            </div>
                        }
                    </Col>
                    <Col span={2}/>
                </Row>
                <Row>
                    <Col span={2}/>
                    <Col span={7}>
                        {
                            listData &&
                            <div style={{marginTop:'5%'}}>
                                <h1 style={{textAlign:'center'}}>Employee List</h1>
                                <Table columns={this.columns}
                                       dataSource={listData}/>
                            </div>
                        }
                    </Col>
                    <Col span={6} style={{paddingTop:'5%'}}>
                        {
                            resultChart &&
                            <Chart
                                width={'500px'}
                                height={'300px'}
                                chartType="PieChart"
                                loader={<div>Loading Chart</div>}
                                data={resultChart}
                                options={{
                                    title: 'Exam result',
                                    is3D: true,
                                    slices: chartColors,
                                }}
                                chartEvents={this.pieChartEvents}
                                rootProps={{ 'data-testid': '1' }}
                            />
                        }
                    </Col>
                    <Col span={7}>
                        {
                            resultData &&
                            <div style={{marginTop:'5%'}}>
                                <h1 style={{textAlign:'center'}}>Employee List</h1>
                                <Table columns={this.columns}
                                       dataSource={resultData}/>
                            </div>
                        }
                    </Col>
                    <Col span={2}/>
                </Row>
            </div>
        );
    }
}

export default Home;