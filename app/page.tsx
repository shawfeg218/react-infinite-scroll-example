"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

type Todo = {
  id: number;
  title: string;
};

export default function Page() {
  const fetchTodos = async ({ pageParam }: { pageParam: number }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const res = await fetch(`https://jsonplaceholder.typicode.com/todos?_page=${pageParam}`);
    console.log("fetchTodos");
    return res.json();
  };

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 0 ? undefined : allPages.length + 1;
    },
  });

  const todos = data?.pages.flatMap((page) => page);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <section className="space-y-4">
        {todos?.map((todo: Todo, index: number) => {
          if (index === todos.length - 1) {
            return (
              <div key={index} ref={ref} className="border space-y-2 p-5 rounded-md">
                <p>{todo.title}</p>
                <div className="bg-slate-200 w-full h-64"></div>
              </div>
            );
          }
          return (
            <div key={index} className="border space-y-2 p-5 rounded-md">
              <p>{todo.title}</p>
              <div className="bg-slate-200 w-full h-64"></div>
            </div>
          );
        })}
      </section>

      {/* <section className="mt-8">
        <Button disabled={!hasNextPage} onClick={() => fetchNextPage()}>
          next
        </Button>
      </section> */}

      {isFetchingNextPage && (
        <section className="mt-8">
          <Loader2 className="animate-spin" />
        </section>
      )}
    </main>
  );
}
