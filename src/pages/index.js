import React from "react";
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import "./style.css";
import { Delete } from "@material-ui/icons";

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
    addTodo(text: $text)
  }
`;
const DELETE_TODO = gql`
  mutation RemoveTodo($id: String!) {
    removeTodo(id: $id)
  }
`

export default function Home() {
  let textInput;

  const [addTodo] = useMutation(ADD_TODO);
  
  const [removeTodo] = useMutation(DELETE_TODO)

  const addNewTodo = () => {
    addTodo({
      variables: {
        text: textInput.value
      },
      refetchQueries: [{ query: GET_TODO }]
    })
    textInput.value = "";
  }
  const handleDelete = (id)=> {
    removeTodo({
      variables: { id: id },
      refetchQueries: [{ query: GET_TODO }],
    })
      }
  const { loading, error, data } = useQuery(GET_TODO);

  if ( loading ) {
    return <h2>Loading...</h2>
  }
  
  if ( error ) {
    return <h2>Loading Error </h2>
  }

  return (
    <div className="container">
      <h1>My Todo List</h1>
      <form className="add_todo">
        <label>
          <input type="text" required ref={node => {textInput = node}} placeholder="Add Todo..." />
        </label>
        <button onClick={addNewTodo}>Add</button>
      </form>
      <ul>
        {data?.todos.map(todo => 
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
