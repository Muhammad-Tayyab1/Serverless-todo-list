import React, { useState } from "react";
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import "./style.css";
import { Delete } from "@material-ui/icons";
import { CircularProgress } from "@material-ui/core";

const GET_TODO = gql`
  {
    todos {
      id,
      text,
      done
    }
  }
`;

const ADD_TODO = gql`
  mutation addTodo($text: String!){
    addTodo(text: $text){
        id
        text
        done
    }
  }
`;
const DELETE_TODO = gql`
  mutation RemoveTodo($id: ID!) {
    removeTodo(id: $id){
        id
      }
  }
`

export default function Home() {
  const [text, setText] = useState("");

  const [addTodo] = useMutation(ADD_TODO);
  
  const [removeTodo] = useMutation(DELETE_TODO)

  const addNewTodo = () => {
    addTodo({
      variables: {
        text: text
      },
      refetchQueries: [{ query: GET_TODO }]
    })
    setText("");
  }
  const handleDelete = (id)=> {
    removeTodo({
      variables: { id: id },
      refetchQueries: [{ query: GET_TODO }],
    })
       }
  const { loading, error, data } = useQuery(GET_TODO);

  if ( loading ) {
    return (
      <CircularProgress className="todoMain" variant="determinate" value={25} />
    );
  }
  
  if ( error ) {
    return <h2>Loading Error </h2>
  }

  return (
    <div className="container">
      <h1>My Todo App</h1>
      <form className="add_todo">
        <label>
          <input type="text" required onChange={(e) => setText(e.target.value)} placeholder="Add Todo..." />
        </label>
        <button onClick={addNewTodo}>Add</button>
      </form>
      <ul>
        {data && data.todos.map(todo => 
          <li key={todo.id}>
            <div className="listTodo">
                <div>

                {todo.text}
                
                </div>
                
                <div className="icons">
                <Delete 
                 edge="end"
                 aria-label="delete" 
                onClick={()=> handleDelete(todo.id)} />
                </div>
               

                </div>
          </li>)}
      </ul>
    </div>
  )
}
