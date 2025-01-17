import React, { useState, useEffect } from "react";
import { Select, Modal, Form, Input, Radio, Space, Button } from "antd";

const NewTicket = () => {
  const { Option } = Select;
  const { TextArea } = Input;

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [issue, setIssue] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [options, setOptions] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchClients = async () => {
    await fetch(`/api/v1/client/allclients`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res) {
          setOptions(res.client);
        }
      });
  };

  const postData = async () => {
   await fetch(`/api/v1/tickets/createTicket`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        name,
        email,
        company,
        issue,
        priority,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          console.log("Congrats it worked");
        }
      });
  };

  const onCreate = async (values) => {
    setVisible(false);
    await postData();
  };

  const onCancel = async () => {
    await setVisible(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const search = options.map((d) => <Option key={d._id}>{d.name}</Option>);

  return (
    <div className="ticket-modal">
      <Button
        type="primary"
        size="small"
        onClick={() => {
          setVisible(true);
        }}
      >
        Create Ticket
      </Button>
      <Modal
        visible={visible}
        title="Create new Ticket"
        onCancel={onCancel}
        centered
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              onCreate(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
        footer={[
          <Button style={{ float: 'left'}} onClick={() => onCancel()}>Cancel</Button>,
          <Button onClick={() => onCreate()}>Submit</Button>
        ]}
      >
        <Form
          size="middle"
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            modifier: "public",
          }}
        >
          <Form.Item name="name">
            <Input
              placeholder="Enter name here..."
              name="name"
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Item>
          <Form.Item name="email">
            <Input
              placeholder="Enter email here...."
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item name="Client">
            <Select
              showSearch
              placeholder="Select a client"
              optionFilterProp="children"
              onChange={setCompany}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {search}
            </Select>
          </Form.Item>
          <Form.Item name="issue" label="Issue">
            <TextArea rows={5} onChange={(e) => setIssue(e.target.value)} />
          </Form.Item>
          <Form.Item
            name="modifier"
            label="Priority"
            className="collection-create-form_last-form-item"
          >
            <Radio.Group
              buttonStyle="solid"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={{ textAlign: "center" }}
            >
              <Space>
                <Radio.Button value="Low">Low</Radio.Button>
                <Radio.Button value="Normal">Normal</Radio.Button>
                <Radio.Button value="High" >High</Radio.Button>
              </Space>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NewTicket;
