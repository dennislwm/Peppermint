const mongoose = require("mongoose");
const Todo = mongoose.model("Todo");

exports.getTodos = async (req, res) => {
  console.log("getTodos");
  try {
  await Todo.find({ createdBy: req.user._id })
      .populate("createdBy", "_id name")
      .then((todo) => {
        res.json({todo});
      });
  } catch (error) {
    console.log(error);
  }
};

exports.createTodo = async (req, res) => {
  // console.log("createTodo");
  try {
    const text = req.body.todo;
    if (!text) {
      console.log("No text found!");
      return res.status(422);
    } else {
      const todo = await new Todo({
        text,
        createdBy: req.user._id,
      });
      todo.save();
      res.status(200).json({
        todo
      })
    }
  } catch (error) {
    console.log(error);
  }
};

exports.deleteTodo = async (req, res) => {
  console.log("deleteTodo");
  try {
    const todo = await new mongoose.Types.ObjectId(req.params.id);
    if (!todo) {
      return res.status(404).json({
        success: false,
        error: "Todo not found.",
      });
    }
    await Todo.findOneAndDelete({ _id: req.params.id });
    return res.status(201).json({
      data: {}
    });
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
};

exports.markOneAsDone = async (req, res) => {
  try {
    const todo = await new mongoose.Types.ObjectId(req.params.id);
    if (!todo) {
      return res.status(404).json({
        success: false,
        error: "Todo not found.",
      });
    } else {
      await Todo.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { done: true } },
        {
          new: true,
        }
      ).exec();
      console.log("Updated record");
      Todo.find({ createdBy: req.user._id })
      .populate("createdBy", "_id name")
      .then((todo) => {
        res.json({todo});
      });
    }

  } catch (error) {
    console.log(error);
  }
};

exports.markAllAsDone = async (req, res) => {
  console.log("markAllAsDone");
  try {
    await Todo.updateMany({ $set: { done: true } }, function (err, result) {
      if (err) {
        res.send(err);
      } else {
        Todo.find({ createdBy: req.user._id })
        .populate("createdBy", "_id name")
        .then((todo) => {
          res.json({todo});
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.markUndone = async (req, res) => {
  console.log('hit')
  console.log(req.params.id)
  try {
    await Todo.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { done: false } },
        {
          new: true,
        }
      ).exec();
      Todo.find({ createdBy: req.user._id })
      .populate("createdBy", "_id name")
      .then((todo) => {
        res.status(200).json({todo});
      });
  } catch (error) {
    console.log(error);
  }
};