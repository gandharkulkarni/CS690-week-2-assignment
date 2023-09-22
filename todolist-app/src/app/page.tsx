import TodoList from "./components/todolist/todolist";
import 'font-awesome/css/font-awesome.min.css';

export default function Home() {
  return (
    <main className="flex justify-center bg-white dark:bg-gray-800 min-h-screen">
      <TodoList />
    </main>
  )
}
