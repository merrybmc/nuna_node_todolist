const mongoose = require('mongoose');
const Task = require('../Task.schema');

const taskService = {};

// 데이터 쓰기 Create
taskService.createTask = async (req, res, next) => {
  try {
    if (req.statusCode === 400) return next();

    const { task, isComplete } = req.body;
    const { validTokenId } = req;
    const newTask = new Task({ task, isComplete, author: validTokenId });
    await newTask.save();

    req.statusCode = 200;
    req.data = newTask;
  } catch (e) {
    res.statusCode = 400;
    req.error = e.message;
  }
  next();
};

// 데이터 읽기 Read
taskService.getTask = async (req, res, next) => {
  try {
    // 다른 collection에 있는 참조된 doc들을 가져온다.
    const taskList = await Task.find({}).populate('author');

    req.statusCode = 200;
    req.data = taskList;
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

// 데이터 수정 Update
taskService.putTask = async (req, res, next) => {
  try {
    if (req.statusCode === 400) return next();

    const { id } = req.params;
    const { isComplete } = req.body;

    // case 1 mongodb
    // const putTask = await Task.updateOne({ _id: id }, { $set: { isComplete } });

    // case 2 $set 생략 가능
    // const putTask = await Task.updateOne({ _id: id }, { isComplete });

    // case 3 mongoose findByIdUpdate
    // parameter 1 = id 값 전달, 알아서 추적해냄
    // parameter 2 = 바꿀 객체 전달
    // parameter 3 = 옵션 객체 {new: true} = 변경사항이 반영된 값 전달 여부
    const putTask = await Task.findByIdAndUpdate(id, { isComplete }, { new: true });

    req.statusCode = 200;
    req.data = putTask;
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

// 데이터 삭제 Delete
taskService.deleteTask = async (req, res, next) => {
  try {
    if (req.statusCode === 400) return next();

    const { id } = req.params;

    console.log(!mongoose.Types.ObjectId.isValid(id));

    // const deleteTask = await Task.deleteOne({ _id: id });
    // findByIdAndDelete는 id값만 전달, 옵션 객체는 일반적으로 많이 쓰이지 않음
    const deleteTask = await Task.findByIdAndDelete(id);

    req.statusCode = 200;
    req.data = deleteTask;
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

module.exports = taskService;
