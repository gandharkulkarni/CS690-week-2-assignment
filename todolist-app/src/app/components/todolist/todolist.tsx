'use client'
import TodoItem from "../todoitem/todoitem";
import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";

const TodoList = () => {
    
    type List = {
        id: number,
        title: string,
        createdAt: string,
        updatedAt: string
    }

    const [list, setLists] = useState<List[]>()
    const [listId, setListId] = useState(0)
    const [isEditFormVisible, setisEditFormVisible] = useState(false)
    const [listTitle, setListTitle] = useState('')
    useEffect(() => {
        fetchLists();
    }, []);

    async function fetchLists() {
        const response = await axios.get<List[]>('http://localhost:7000/todolist');
        setLists(response.data);
    }
    const handleDeleteList = async(id:number) =>{
        const response = await axios.delete('http://localhost:7000/todolist', {params:{id:id}});
        if(response){
            fetchLists();
        }
    }
    const handleAddList = async() =>{
        let listTitle = document.getElementById('newListTitle')
        if(listTitle!==null){
            let newListTitle = listTitle.value;
            if(newListTitle!==""){
                const response = await axios.post('http://localhost:7000/todolist',{
                    todo_lists:[
                        {
                            title: newListTitle
                        }
                    ]
                });
                if(response){
                    fetchLists()
                    listTitle.value = ""
                }
            }
        }
    }
const handleEditListForm = async(id:number, title: string) =>{
    setListId(id)
    setListTitle(title)
    setisEditFormVisible(!isEditFormVisible)
}
const handleEditListTitle = async () =>{
    let updatedTitle = document.getElementById('editTitle').value
    if(updatedTitle!=""){
        const response = await axios.put('http://localhost:7000/todolist', {
            todo_lists:[
                {
                    id: listId,
                    title: updatedTitle
                }
            ]
        })
        if(response){
            fetchLists()
            setisEditFormVisible(!isEditFormVisible)
        }
    }
}

    return (
        <div className="shadow-lg p-5">
            <div className="flex justify-center items-center text-center p-4">
                <h1 className="text-gray-900 dark:text-white"></h1><br/>
                <input type="text" placeholder="Add a new todo list" id = {'newListTitle'} className="rounded-lg m-2 p-2"></input>
                <a className="bg-green-500 rounded-lg m-2 p-2 text-white" onClick={handleAddList}>
                    <i className="fa fa-plus text-white p-2"></i>
                </a>
            </div>
            {list !== undefined && list.map((l) => {
                return(
                    <div key={l.id} className="flex w-full justify-center m-5 p-2 bg-gray-800 rounded-lg">
                        {isEditFormVisible && l.id===listId && (
                                <div>
                                <input type="text" className="rounded-lg m-2 p-2 px-4" id="editTitle" value={listTitle} onChange={(e)=> setListTitle(e.target.value)} />
                                <a className="bg-green-500 rounded-lg m-2 p-2 px-4" onClick={handleEditListTitle} ><i className="fa fa-check text-white p-2"></i></a>
                                </div>
                        )}
                        <TodoItem id={l.id} title={l.title}></TodoItem>
                        <div className="">
                            <a className="bg-yellow-400 p-2 px-6 m-6  text-white rounded-lg" onClick={()=> handleEditListForm(l.id, l.title)}><i className="fa fa-pencil text-white p-2"></i></a> <br/><br/>
                            <a className="bg-red-400 p-2 px-6 m-6  text-white rounded-lg" onClick={()=> handleDeleteList(l.id)}><i className="fa fa-trash text-white p-2"></i></a>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};
export default TodoList;

