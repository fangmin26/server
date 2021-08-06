//GET은 Select적인 성향을 가지고 있습니다. GET은 서버에서 어떤 데이터를 가져와서 보여준다거나 하는 용도이지 서버의 값이나 상태등을 바꾸지 않습니다. 
//게시판의 리스트라던지 글보기 기능 같은 것이 이에 해당하죠.(방문자의 로그를 남긴다거나 글읽은 횟수를 올려준다거나 하는건 예외입니다.) 
//반면에 POST는 서버의 값이나 상태를 바꾸기 위해서 사용합니다. 글쓰기를 하면 글의 내용이 디비에 저장이 되고 수정을 하면 디비값이 수정이 되죠. 
//이럴 경우에 POST를 사용합니다.

//get :url 에 변수데이터 포함,노출 취약,캐싱가능(레지스터에데이터저장) post :url에 변수 노출x,캐싱x,기본보안
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware: 어플리케이션과 데이터및 사용자 연결하는 요소
app.use(cors());
app.use(express.json()); //req.body

//Routes
//create todo

app.post("/todos", async (req, res) => {
  try {
    // console.log(req.body);
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES($1) ",
      [description]
    );
    res.json(newTodo.rows);
    // res.json(newTodo);차이를 모르겠음
  } catch (err) {
    console.error(err.massage);
  }
});
//get all todo
app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo");
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err);
  }
});
//get a todo
app.get("/todos/:id", async (req, res) => {
  //app.get("/todos/:subject",async(req,res)=>{ //포스트맨에서 랜덤값으로 받음

  try {
    // console.log(req.params)
    const { id } = req.params;
    //$는 최상위객체의 의미?? 모르겠음
    /*where 집합을 선택, 조건문으로도 사용가능함 
    cf. SELECT * FROM weather
    WHERE city = 'San Francisco' AND prcp > 0.0;*/
    //RETURNING: INSERT,UPDATE,DELETE 문 뒤에 사용하면 실행 결과 rows를 반환함
    const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1 ", [
      id,
    ]);
    res.json(todo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});
//upadate todo
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateTodo = await pool.query(
      "UPDATE todo SET description = $1 WHERE todo_id = $2",
      [description, id]
    );
    res.json("todo was updated");
  } catch (err) {
    console.error(err.message);
  }
});

//delete todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [
      id,
    ]);
    res.json("todo delete");
  } catch {
    console.error(err.message);
  }
});
//실동작하는 서버
app.listen(5000, () => {
  console.log("server has started on port 5000");
});
