import { deferred } from "https://deno.land/std@0.212.0/async/deferred.ts";
import { sortBy } from "https://deno.land/std@0.212.0/collections/sort_by.ts";


export enum SchedulerPriority {
    Low = 2,
    Medium = 1,
    High = 0
}

export function createScheduler<T extends { priority: SchedulerPriority; }>() {
    let hasTask = deferred<void>();
    const queue: T[] = [];
    const scheduler = new ReadableStream<T>({
        pull: async (controller) => {
            if (queue.length === 0) {
                hasTask = deferred<void>();
                await hasTask;
            }
            const task = sortBy(queue, it => it.priority)[ 0 ];
            controller.enqueue(task);
            queue.splice(queue.indexOf(task), 1);
        }
    });
    return {
        scheduler,
        add: (object: T) => {
            queue.push(object);
            hasTask.resolve();
        }
    };
}
