import {useState, useRef } from 'react'
import { BASE_URL } from '../App'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { IoReload } from 'react-icons/io5'

export default function TodoForm() {
    const [newTodo, setNewTodo] = useState("")
    const [isPending, setIsPending] = useState(false)
    const taskName = useRef<HTMLInputElement>(null)

    const queryClient = useQueryClient()

    const {mutate: createTodo} = useMutation({
        mutationKey: ["createTodo"],
        mutationFn: async (taskName: string) => {
            setIsPending(true)
            try {
                const response = await fetch(`${BASE_URL}/todos`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ body: taskName })
                })
                const data = await response.json()
                setIsPending(false)
                if (!response.ok) {
                    throw new Error("Failed to create todo")
                }
                return data;
            } catch (error) {
                console.error("Error creating todo:", error)
            }
        },
        onSuccess: () => {
            setNewTodo("")
            if (taskName.current) {
                taskName.current.value = ""
                taskName.current.focus()
            }
            queryClient.invalidateQueries({ queryKey: ["todos"] })  
        },
        onError: (error) => {
            console.error("Error creating todo:", error)
            setIsPending(false)
        }

    })

    return (
        <div>
            <h2>Add Task</h2>
            <form onSubmit={(e) => {e.preventDefault(); createTodo(newTodo); }}>
                <input type="text" name="taskName" value={newTodo} placeholder="Task Name" onChange={(e) => setNewTodo(e.target.value)} ref={(input) => input && input.focus()} />
                 {isPending ? <IoReload color="gray" size={20} className="spin" /> :  <button type="submit">Add Task</button> }
                 
            </form>
        </div>
    )
}
