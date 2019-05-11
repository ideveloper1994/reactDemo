import React, { Component } from 'react';
import { Table, Row, Col, Modal, Input, Button } from 'antd';
import { find, groupBy } from 'lodash';
import './home.css';
import { Chart } from "react-google-charts";


class Home extends Component{

    constructor(props) {
        super(props);
        let obj = [
            {id:1, name: 'iPhone 5', category: 'Mobile', price: 20000},
            {id:2, name: 'iPhone 6', category: 'Mobile', price: 30000},
            {id:3, name: 'iPhone 6s', category: 'Mobile', price: 40000},
            {id:4, name: 'C#', category: 'Book', price: 55000},
            {id:5, name: '.NET', category: 'Book', price: 60000},
            {id:6, name: 'PHP', category: 'Book', price: 80000},
        ];
        let groupObj = groupBy(obj, 'category');
        let groupArr = Object.keys(groupObj).map(x=> {return {type:{mainKey:x, data: groupObj[x]}}});
        this.state = {
            products: groupArr,
            visible: false,
            modelTitle: '',
            selectedItem: {name:'',price:''}
        };

        this.columns = [
            {title: 'Data', dataIndex: 'type', key: 'type',
                render: (record) =>
                    <div>
                        <h4>{record.mainKey}</h4>
                        {
                            record.data.map((obj,index)=> {
                                return(
                                    <div>
                                        <span style={{marginRight:10}}>{obj.name}</span>
                                        <span style={{marginRight:10}}>{obj.price}</span>
                                    </div>
                                )
                            })
                        }
                    </div>

            },
            {title: 'Action', dataIndex: '', key: 'x',
                render: (record) =>
                    <div>
                        <a href='javascript:void(0)'
                           onClick={()=>this.onEdit(record)}
                           style={{ marginRight: 8 }}>Edit</a>
                        <a href='javascript:void(0)'
                           onClick={()=>this.onDelete(record)}>Delete</a>
                    </div>

            },
        ];
    }

    onDelete = (obj) => {
        const {products} = this.state;
        const objIndex = products.indexOf(obj);
        products.splice(objIndex,1);
        this.setState({
            products
        });
    };

    onEdit = (obj) => {
        this.setState({
            visible: true,
            modelTitle: 'Edit Product',
            selectedItem: obj
        });
    };

    onSave = () => {
        let { products, selectedItem } = this.state;
        if(selectedItem.id){
            const obj = find(products, {id: selectedItem.id});
            const objIndex = products.indexOf(obj);
            products[objIndex] = selectedItem;
        }else{
            selectedItem.id = products.length + 1;
            products = [...products, selectedItem];
        }
        this.setState({
            products,
            visible: false
        });
    };

    closeModel = () => {
        this.setState({
            visible: false,
            modelTitle: '',
            selectedItem: null
        });
    };

    onTextChange = (key, value) => {
        const { selectedItem } = this.state;
        this.setState({
            selectedItem: {...selectedItem,[key]: value}
        });
    };

    onAddNew = () => {
        this.setState({
            visible: true,
            modelTitle: 'Add Product',
            selectedItem: {name:'',price:''}
        });
    };

    renderModal = () => {
        const { visible, modelTitle, selectedItem } = this.state;
        return(
            <Modal
                title={modelTitle}
                visible={visible}
                onOk={this.onSave}
                onCancel={this.closeModel}>
                {
                    selectedItem &&
                    <div>
                        <Input placeholder="Product name"
                               value={selectedItem.name}
                               onChange={(e)=>this.onTextChange('name',e.target.value)}
                               type={'text'}/>
                        <Input placeholder="price"
                               type={'number'}
                               value={selectedItem.price}
                               onChange={(e)=>this.onTextChange('price',e.target.value)}
                               style={{marginTop:'5%'}}/>
                    </div>
                }
            </Modal>
        )
    };

    render() {
        const { products } = this.state;
        return(
            <div style={{ marginTop:'1%' }}>
                <h1 style={{textAlign:'center'}}>Products</h1>
                <Row>
                    <Col span={7}/>
                    <Col span={10}>
                        <Button type="primary"
                                onClick={this.onAddNew}
                                style={{ marginBottom:'1%' }}>Add Product</Button>
                        <Table columns={this.columns}
                               dataSource={products}/>
                    </Col>
                    <Col span={7}/>
                </Row>

                {
                    this.renderModal()
                }
            </div>
        );
    }
}

export default Home;