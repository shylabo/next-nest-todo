import React, { ChangeEvent } from 'react'
import { useState, useEffect, useCallback, useRef } from 'react'
import { debounce } from 'lodash'
import ToDo from './ToDo'

interface Todo {
  id: number
  name: string
  completed: boolean
}

const ToDoList = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [mainInput, setMainInput] = useState('')
  const [filter, setFilter] = useState<boolean | undefined>()
  const didFetchRef = useRef(false)

  useEffect(() => {
    if (didFetchRef.current === false) {
      didFetchRef.current = true
      fetchTodos()
    }
  }, [])

  async function fetchTodos(completed?: boolean) {
    let path = '/todos'
    if (completed !== undefined) {
      path = `/todos?completed=${completed}`
    }
    console.log(path)
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + path)
    const json = await res.json()
    setTodos(json)
  }

  const debouncedUpdateTodo = useCallback(debounce(handleUpdateTodo, 500), [])

  function handleToDoChange(e: ChangeEvent<HTMLInputElement>, id: number) {
    const target = e.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const key = target.name
    const copy = [...todos]
    const idx = todos.findIndex((todo) => todo.id === id)
    const changedToDo = {
      ...todos[idx],
      [key]: value,
    }
    copy[idx] = changedToDo
    debouncedUpdateTodo(changedToDo)
    setTodos(copy)
  }

  async function handleUpdateTodo(todo: Todo) {
    const payload = {
      name: todo.name,
      completed: todo.completed,
    }
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/todos/${todo.id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  async function handleAddToDo(name: string) {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/todos`, {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        completed: false,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (res.ok) {
      const created = await res.json()
      const copy = [created, ...todos]
      setTodos(copy)
    }
  }

  async function handleDeleteToDo(id: number) {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (res.ok) {
      const idx = todos.findIndex((todo: any) => todo.id === id)
      const copy = [...todos]
      copy.splice(idx, 1)
      setTodos(copy)
    }
  }

  function handleMainInputChange(e: ChangeEvent<HTMLInputElement>) {
    setMainInput(e.target.value)
  }

  function handleEnter(e: any) {
    if (e.key === 'Enter') {
      if (mainInput.length > 0) {
        handleAddToDo(mainInput)
        setMainInput('')
      }
    }
  }

  function handleFilterChange(value?: boolean) {
    setFilter(value)
    fetchTodos(value)
  }

  return (
    <div className="p-5">
      <h1 className="text-lg font-bold">Todo List</h1>
      <div className="mb-5">
        <input
          className="
            w-2/5
            h-8
            mt-3
            pl-2
            bg-gray-50
            border
            border-gray-300
            rounded
            text-gray-900 text-sm
            "
          placeholder="What needs to be done?"
          value={mainInput}
          onChange={handleMainInputChange}
          onKeyDown={handleEnter}
        />
      </div>
      {/* Filters */}
      <div className="flex gap-5 my-5 items-center">
        <span>Filter:</span>
        <button
          className="w-auto h-8 bg-sky-500 text-white py-1 px-4 rounded"
          onClick={() => handleFilterChange()}
        >
          All
        </button>
        <button
          className="w-auto h-8 bg-gray-500 text-white py-1 px-4 rounded"
          onClick={() => handleFilterChange(false)}
        >
          Active
        </button>
        <button
          className="w-auto h-8 bg-green-500 text-white py-1 px-4 rounded"
          onClick={() => handleFilterChange(true)}
        >
          Completed
        </button>
      </div>
      <hr className="my-5" />
      {!todos && <div>Loading...</div>}
      {todos.length > 0 && (
        <ul>
          <li className="flex flex-col gap-3">
            {todos.map((todo) => {
              return (
                <ToDo
                  key={todo.id}
                  todo={todo}
                  onDelete={handleDeleteToDo}
                  onChange={handleToDoChange}
                />
              )
            })}
          </li>
        </ul>
      )}
    </div>
  )
}

export default ToDoList
