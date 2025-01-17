import React, { useState } from "react";
import { Button, Modal, Input } from "antd";
import { EditTwoTone } from "@ant-design/icons";

const EditNote = (props) => {
  const [visible, setVisible] = useState(false);
  const [note, setNote] = useState(props.notes.note);
  const [id, setId] = useState("");

  const postData = async () => {
    await fetch(`/api/v1/note/updateNote`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        note,
        id,
      }),
    }).then((res) => res.json);
  };

  const onCreate = async (e) => {
    e.stopPropagation();
    setVisible(false);
    await postData();
  };

  const onCancel = (e) => {
    e.stopPropagation();
    setVisible(false);
    setId("");
    setNote("");
  };

  const { TextArea } = Input;

  return (
    <div>
      <Button
        size="xs"
        style={{ float: "right", marginLeft: 5 }}
        onClick={() => {
          setVisible(true);
          setId(props.notes._id);
        }}
      >
        <EditTwoTone />
        <Modal
          keyboard={true}
          visible={visible}
          title={props.notes.title}
          okText="Update"
          cancelText="Cancel"
          onCancel={onCancel}
          onOk={onCreate}
          centered
        >
          <TextArea
            defaultValue={props.notes.note}
            onChange={(e) => setNote(e.target.value)}
            rows={30}
          />
        </Modal>
      </Button>
    </div>
  );
};

export default EditNote;
