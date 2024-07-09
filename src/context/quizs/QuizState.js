import QuizContext from "./quizContext";
import { useState } from "react";

const QuizState = (props) => {
  const host = "http://localhost:1000"
  const quizsInitial = []
  const [quizs, setQuizs] = useState(quizsInitial)


  


  
  const getQuizs = async () => {
    const response = await fetch(`${host}/api/quiz/fetchallquiz`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')
      }
    });
    const json = await response.json() 
    
    console.log("GET ALL QUIZ" ,json[0].user);
    window.value=json[0].user;
   
    setQuizs(json)
  }

 
  const addQuiz = async (question, option1, option2, option3, option4, answer, title, mcq) => {
     
    const response = await fetch(`${host}/api/quiz/addquiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({question, option1, option2, option3, option4, answer,title, mcq})
    });

    const quiz = await response.json();
    setQuizs(quizs.concat(quiz))
  }
  const deleteQuiz = async (id) => {
    const response = await fetch(`${host}/api/quiz/deletequiz/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')
      }
    });
    const json = response.json(); 
    console.log(json, "DEL")
    const newQuizs = quizs.filter((quiz) => { return quiz._id !== id })
    setQuizs(newQuizs)
  }
  const editQuiz = async (id, question, option1, option2, option3, option4, answer, title, mcq, code) => { 
    const response = await fetch(`${host}/api/quiz/updatequiz/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "auth-token":localStorage.getItem('token')
      },
      body: JSON.stringify({question, option1, option2, option3, option4, answer, title, mcq, code})
    });
    const json = await response.json(); 
    console.log(json, "UPDATE")

     let newQuizs = JSON.parse(JSON.stringify(quizs))
    
    for (let index = 0; index < newQuizs.length; index++) {
      const element = newQuizs[index];
      if (element._id === id) {
        newQuizs[index].question = question;
        newQuizs[index].option1 = option1;
        newQuizs[index].option2 = option2;
        newQuizs[index].option3 = option3;
        newQuizs[index].option4 = option4;
        newQuizs[index].answer = answer; 
        newQuizs[index].title = title; 
        newQuizs[index].mcq = mcq; 
        newQuizs[index].code = code; 
        break; 
      }
    }  
    setQuizs(newQuizs);
  }

  const editCode = async ( code ) => {
  
    const response = await fetch(`${host}/api/quiz/updatecode/${window.value}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "auth-token":localStorage.getItem('token')
      },
      body: JSON.stringify({ code })
    });
    const json = await response.json(); 
    console.log(json, "EDIT CODE")

     let newQuizs = JSON.parse(JSON.stringify(quizs))
    for (let index = 0; index < newQuizs.length; index++) {
      const element = newQuizs[index];
      if (element.user === window.value) {
        newQuizs[index].code = code;
        break; 
      }
    }  
    setQuizs(newQuizs);
  }
  return (
    <QuizContext.Provider value={{ quizs, addQuiz, deleteQuiz, editQuiz, getQuizs, editCode}}>
      {props.children}
    </QuizContext.Provider>
  )

}
export default QuizState;