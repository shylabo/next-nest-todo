import React from 'react'

const ToDo = (props: any) => {
  const { todo, onChange, onDelete } = props
  return (
    <div className="flex justify-start items-center gap-2" key={todo.id}>
      <input
        className="w-5 h-5 border-gray-300 rounded"
        name="completed"
        type="checkbox"
        checked={todo.completed}
        value={todo.completed}
        onChange={(e) => onChange(e, todo.id)}
      />
      <span>{todo.id}:</span>
      <input
        autoComplete="off"
        name="name"
        type="text"
        value={todo.name}
        onChange={(e) => onChange(e, todo.id)}
      />
      <button
        className="bg-rose-500 text-white py-1 px-4 rounded"
        onClick={() => onDelete(todo.id)}
      >
        Delete
      </button>
    </div>
  )
}

export default ToDo
