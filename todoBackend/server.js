const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mern-app')
    .then(() => {
        console.log('DB connected');
    })
    .catch((err) => {
        console.log(err);
    });

// define schema
const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type:String
    },
    description: String
});

// create model
const todoModel = mongoose.model('Todo', todoSchema);

// POST route to create a new todo
app.post('/todos', async (req, res) => {
    const { title, description } = req.body;
    try {
        const newTodo = new todoModel({ title, description });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
});

// GET route to get all todos
app.get('/todos', async (req, res) => {
    try {
        const todos = await todoModel.find();
        res.json(todos);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving todos");
    }
});
// get all items
app.get('/todos',async(req,res)=>{
    try{
      const todos = await  todoModal.find();
      res.json(todos)
    }catch (error){
        console.log(error);
        res.status(500).send("Error retrieving todos");
    }
})

//update todo item
app.put('/todos/:id',async (req,res)=>{
   try{
    const { title, description } = req.body;
    const id = req.params.id;
   const updatedTodo = await todoModel.findByIdAndUpdate(
     id,
     {title,description},{
        new:true
     }
    )
    if(!updatedTodo){
     return res.status(404).json({message: "Todo not found"})
    }
    res.json(updatedTodo)
 

   }catch (error){
    console.log(error);
    res.status(500).send("Error retrieving todos");
   }
})

//delete a to do item
app.delete('/todos/:id',async(req,res)=>{
    try {
        const id =req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
        
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving todos");
    }
   
})


// start server
const port = 3000;
app.listen(port, () => {
    console.log("Server is listening to port " + port);
});
