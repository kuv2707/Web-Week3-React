import TodoListItem from "../components/TodoListItem";
import AddTask from "../components/AddTask";
import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { useAuth } from "../context/auth";
import { useRouter } from "next/router";

export default function Home({ toast }) {
	const { token } = useAuth();
	const [tasks, setTasks] = useState([]);
	const router = useRouter();
	useEffect(() => {
		getTasks();
		if (!token) router.push("/login");
	}, []);
	async function getTasks() {
		/***
		 * @done Fetch the tasks created by the user.
		 * @done Set the tasks state and display them in the using TodoListItem component
		 * The user token can be accessed from the context using useAuth() from /context/auth.js
		 */
		try {
			let resp = await axios.get("todo/", {
				headers: {
					Authorization: `Token ${token}`,
				},
			});
			setTasks(resp.data);
		} catch (err) {
			return [];
		}
	}
	const removeHandler = (task) => {
		return () => {
			setTasks((tasks) => tasks.filter((t) => t.id !== task.id));
		};
	};
	return (
		<div>
			<center>
				<AddTask token={token} add={getTasks} />
				<ul className="flex-col mt-9 max-w-sm mb-3 ">
					<span className="inline-block bg-blue-600 py-1 mb-2 px-9 text-sm text-white font-bold rounded ">
						Enqueued Tasks:{" "}
						{tasks.length == 0 ? "None" : tasks.length}
					</span>
					{tasks.map((task, i) => {
						return (
							<TodoListItem
								task={task}
								key={task.id}
								onRemove={removeHandler(task)}
								token={token}
								toast={toast}
							/>
						);
					})}
				</ul>
			</center>
		</div>
	);
}
