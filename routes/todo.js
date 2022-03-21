const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const Todo = require("../models/Todo");
const { body, validationResult } = require("express-validator");

// ROUTE 1:GET ALL THE TODO USING :GET "/api/todo/fetchtodo".Login required.
router.get("/fetchtodo", fetchUser, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id });
    res.json(todos);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server error");
  }
});
//ROUTE 2:ADD A NEW TODO USING :POST "api/todo/addtodo". Login required.
router.post(
  "/addtodo",
  fetchUser,
  [body("value", "Enter a valid todo").isLength({ min: 3 })],
  async (req, res) => {
    try {
      const { value, checked } = req.body.value;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const todo = await Todo.create({
        user: req.user.id,
        value: value,
        checked: checked,
      });
      const savedtodo = await todo.save();
      res.json(savedtodo);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server error");
    }
  }
);
//ROUTE 3:UPDATE AN EXISTING TODO USING :PUT "api/todo/updatetodo".login required.
router.put("/updatetodo/:id", fetchUser, async (req, res) => {
  const todoToBeUpdated= req.body;
  console.log(req.params);
  console.log(todoToBeUpdated);
  //Create a newTodo object
  try {
    //Find the todo to be updated and update it.
    //const newTodo={...updatedTodo};
    
    let todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).send("Not Found");
    }

    if (todo.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    todo.checked=!todo.checked;
    await todo.save().then(updatedTodo=>{
      console.log(updatedTodo);
    });
    // let element = await Todo.findByIdAndUpdate(req.params.id, {$set: newTodo}, {
    //   new: true,
    // });
    //console.log(todo);
    res.json({ todo });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server error");
  }
});

//Route 4:Delete an existing todo using DELETE "/api/todo/deletetodo".Login required.
router.delete("/deletetodo/:id", fetchUser, async (req, res) => {
  try {
    //Find the note to be delete and delete it.
    let todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).send("Not Found");
    }
    //Allow deletion only if user owns this note.
    if (todo.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    todo = await Todo.findByIdAndDelete(req.params.id);
    res.json({ Success: "Todo has been deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server error");
  }
});

module.exports = router;
