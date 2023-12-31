"use server";

export async function getTodos(pageParam: number) {
  console.log("getTodos", pageParam);
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos?_page=${pageParam}`);
  return res.json();
}
