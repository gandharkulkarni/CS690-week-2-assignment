import axios from "axios";
import { useEffect, useState } from "react";
import React from "react";
interface TodoItemProps {
    id: number,
    title: string
}
const TodoItem: React.FC<TodoItemProps> = ({ id, title }) => {
    type todoItem = {
        id: number,
        todo_list_id: number,
        content: string,
        due_date: string,
        is_completed: boolean,
        createdAt: string,
        updatedAt: string
    }
    const [items, setItems] = useState<todoItem[]>()
    const [todoListId, setTodoListId] = useState<number>(0)
    const [isAddFormVisible, setisAddFormVisible] = useState(false)
    const [isEditFormVisible, setisEditFormVisible] = useState(false)
    const [itemId, setItemId] = useState(0)
    const [itemContent, setItemContent] = useState('')
    const [itemDueDate, setItemDueDate] = useState('')
    const [itemCompletedStatus, setItemCompletedStatus] = useState(false)
    useEffect(() => {
        fetchTodoItems(id);
    }, [])
    async function fetchTodoItems(id: number) {
        const response = await axios.get<todoItem[]>(`http://localhost:7000/todoitem?todo_list_id=${id}`)
        setItems(response.data);
        setTodoListId(id);
    }
    const handleDeleteItem = async (todoItemId: number) => {
        const response = await axios.delete('http://localhost:7000/todoitem', { params: { id: todoItemId, todo_list_id: todoListId } });
        if (response) {
            fetchTodoItems(todoListId);
        }
    }
    const handleAddItemForm = async () => {
        setisAddFormVisible(!isAddFormVisible)
    }

    const handleEditItemForm = async (id: number) => {
        const foundItem = items?.find(item => item.id == id)
        if (foundItem) {
            setItemId(id)
            setItemContent(foundItem.content)
            setItemDueDate(new Date(foundItem.due_date).toISOString().slice(0, 10))
            setItemCompletedStatus(foundItem.is_completed)
            setisEditFormVisible(!isEditFormVisible)
        }

    }
    const handleAddItem = async () => {
        let content = document.getElementById('content').value
        let dueDate = document.getElementById('dueDate').value
        if (content !== "" && dueDate !== "") {
            const response = await axios.post('http://localhost:7000/todoitem', {
                todo_items: [
                    {
                        todo_list_id: todoListId,
                        content: content,
                        due_date: dueDate,
                        is_completed: false
                    }
                ]
            });
            if (response) {
                fetchTodoItems(todoListId)
                handleAddItemForm()
            }
        }
    }

    const handleEditItem = async (id: number) => {
        let content = document.getElementById('editContent').value
        let dueDate = document.getElementById('editDueDate').value
        let isCompleted = document.getElementById('isCompleted').checked
        console.log(isCompleted)
        if (content !== "" && dueDate !== "") {
            const response = await axios.put('http://localhost:7000/todoitem', {
                todo_items: [
                    {
                        id: id,
                        todo_list_id: todoListId,
                        content: content,
                        due_date: dueDate,
                        is_completed: isCompleted
                    }
                ]
            })
            if (response) {
                fetchTodoItems(todoListId)
                setisEditFormVisible(!isEditFormVisible)
            }
        }
    }

    return (
        <div className="bg-gray-900 w-full">
            <ul className="bg-gray-900 text-white p-4 rounded-lg shadow-lg"> {title}
                {items !== undefined && items.map((item) => {
                    return (
                        <div key={item.id} className="bg-gray-900 text-white p-6">
                            <li key={item.id}> {item.content} | Due: {new Date(item.due_date).toISOString().slice(0, 10)} | Completed: {String(item.is_completed)} </li>
                            <input type="button" className="bg-red-900 rounded-lg p-2 m-2" value={'Delete'} onClick={() => handleDeleteItem(item.id)} />
                            <input type="button" className="bg-blue-500 p-2 m-2 text-white rounded-lg" value={'Edit'} onClick={() => handleEditItemForm(item.id)}></input>
                        </div>
                    )
                })}
            </ul>
            <input type="button" className="bg-green-500 p-2 m-2 text-white rounded-lg" value={'New item'} onClick={handleAddItemForm}></input>
            {isAddFormVisible && (
                <form>
                    <input type="text" className="rounded-lg m-2 p-2" placeholder="content" id="content" />
                    <input type="Date" className="rounded-lg m-2 p-2" placeholder="Due Date" id="dueDate" />
                    <input type="button" value={'Add'} className="bg-green-500 rounded-lg m-2 p-2 text-white" onClick={handleAddItem}></input>
                </form>
            )}
            {isEditFormVisible && (
                <form> 

                    <label htmlFor="editContent" className="text-white">Content</label>
                    <input type="text" className="rounded-lg m-2 p-2" placeholder="content" id="editContent" value={itemContent} onChange={(e) => setItemContent(e.target.value)} />

                    <label htmlFor="editDueDate" className="text-white">Due Date</label>
                    <input type="Date" className="rounded-lg m-2 p-2" placeholder="Due Date" id="editDueDate" value={itemDueDate} onChange={(e) => setItemDueDate(e.target.value)} />
                    <br />
                    <label htmlFor="isCompleted" className="text-white">Completed?</label>
                    <input type="CheckBox" className="rounded-lg m-2 p-2" placeholder="Completed" id="isCompleted" checked={itemCompletedStatus} onChange={(e) => setItemCompletedStatus(!itemCompletedStatus)} />
                    <input type="button" value={'Update'} className="bg-blue-500 rounded-lg m-2 p-2 text-white" onClick={() => handleEditItem(itemId)}></input>
                </form>
            )}
        </div>
    );
};
export default TodoItem;
