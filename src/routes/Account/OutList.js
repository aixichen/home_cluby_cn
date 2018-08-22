import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import numeral from 'numeral';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Modal,
  message,
  Divider,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TableList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      title="新建支出"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="主题">
        {form.getFieldDecorator('amount_title', {
          rules: [{ required: true, message: '请输入主题' }],
        })(<Input placeholder="主题" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="金额">
        {form.getFieldDecorator('amount', {
          rules: [{ required: true, message: '请输入金额' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="支出类型">
        {form.getFieldDecorator('amount_type', {
          rules: [{ required: true, message: '请选择支出类型' }],
        })(
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="请选择支出类型"
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value="1">超市</Option>
            <Option value="2">买菜</Option>
            <Option value="3">交通</Option>
            <Option value="4">零食</Option>
            <Option value="5">医疗</Option>
            <Option value="6">家庭餐饮</Option>
            <Option value="7">狗狗</Option>
            <Option value="8">头发护理</Option>
            <Option value="9">生活服务</Option>
            <Option value="10">彩票</Option>
            <Option value="11">水果</Option>
            <Option value="12">房租水电</Option>
            <Option value="13">电影</Option>
            <Option value="14">服装</Option>
            <Option value="15">家用电器-设备</Option>
            <Option value="16">手机通讯</Option>
          </Select>
        )}
      </Form.Item>

      <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="日期">
        {form.getFieldDecorator('amount_date', {
          rules: [{ required: true, message: '请选择生效日期' }],
        })(<DatePicker placeholder="日期" style={{ width: '100%' }} />)}
      </Form.Item>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
        {form.getFieldDecorator('remark', {
          rules: [{ required: false, message: '请输入备注' }],
        })(<Input placeholder="请输入备注" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ account, loading }) => ({
  account,
  loading: loading.models.account,
}))
@Form.create()
export default class OutList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'account/fetch',
      payload: { account_type: 2 },
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      account_type: 2,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'account/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'account/fetch',
      payload: { account_type: 2 },
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'account/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      });
      values.account_type = 2;
      dispatch({
        type: 'account/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const data = fields;
    data.account_type = 2;
    data.amount_date = moment(data.amount_date).format('YYYY-MM-DD');
    dispatch({
      type: 'account/add',

      payload: data,
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="备注">
              {getFieldDecorator('id')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="类型">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="更新日期">
              {getFieldDecorator('date')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
              )}
            </FormItem>
          </Col>

          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  render() {
    const {
      account: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible } = this.state;

    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
      },
      {
        title: '日期',
        dataIndex: 'amount_date',
        render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '主题',
        dataIndex: 'amount_title',
      },
      {
        title: '类型',
        dataIndex: 'amount_type_cn',
      },
      {
        title: '金额',
        dataIndex: 'amount',
        sorter: true,
        align: 'right',
        render: val => `${numeral(val).format('0,0.00')} RMB`,
        // mark to display a total number
        needTotal: true,
      },
      {
        title: '备注',
        dataIndex: 'remark',
      },
      {
        title: '更新时间',
        dataIndex: 'updated_at',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: () => (
          <Fragment>
            <a href="">修改</a>
            <Divider type="vertical" />
            <a href="">删除</a>
          </Fragment>
        ),
      },
    ];

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout title="支出详情">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button onClick={this.handleMenuClick} key="remove">
                    删除
                  </Button>
                  {/* <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown> */}
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderLayout>
    );
  }
}
