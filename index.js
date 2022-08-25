/**
 * Note: This function is used to create jobs that consume time of few 100 milliseconds (randomly);
 */
var doTask = (taskName) => {
  var begin = Date.now();
  console.log("\x1b[33m", "[TASK] STARTING TASK: " + taskName, "\x1b[0m");
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      var end = Date.now();
      var timeSpent = end - begin + "ms";
      console.log(
        "\x1b[36m",
        "[TASK] FINISHED: " + taskName + " in " + timeSpent,
        "\x1b[0m"
      );
      resolve(true);
    }, Math.random() * 200);
  });
};

/**
 * Note: This function is used to initiate the jobs and is the main function
 */
async function init() {
  numberOfTasks = 20;
  const concurrencyMax = 4;
  const taskList = [...Array(numberOfTasks)].map(() =>
    [...Array(~~(Math.random() * 10 + 3))]
      .map(() => String.fromCharCode(Math.random() * (123 - 97) + 97))
      .join("")
  );
  const counter = 0;
  const concurrencyCurrent = 0;
  console.log("[init] Concurrency Algo Testing...");
  console.log("[init] Tasks to process: ", taskList.length);
  console.log("[init] Task list: " + taskList);
  console.log("[init] Maximum Concurrency: ", concurrencyMax, "\n");

  await manageConcurrency(
    taskList,
    counter,
    concurrencyMax,
    concurrencyCurrent
  );
}

/**
 * Note: This function take array of promises and resolve them in parallel
 */
const resolveConcurrentRequest = (promises) => Promise.all(promises);

/**
 * Note: This function is responsible for initiating the concurrent jobs
 */
const manageConcurrency = async (
  taskList = [],
  counter = 0,
  concurrencyMax = 4,
  concurrencyCurrent = 0
) => {
  let concurrentTaskList = []; // In this array we store concurrent
  // The outer loop is responsible for iterating  the tasklists
  while (counter < taskList.length) {
    // while (concurrencyCurrent < concurrencyMax && counter < taskList.length) {

    console.log(
      "Concurrency: ",
      concurrencyCurrent + 1,
      " of ",
      concurrencyMax
    );
    console.log("Task count: ", counter, " of ", taskList.length);
    concurrentTaskList.push(doTask(taskList[counter])); // task added to current task list
    counter++; // task count incremented
    concurrencyCurrent++; // concurrent task count incremented
    /**
     * Note: This is the main logic for the task and it will work like that at
     * it will fill the array of concurrent tasks until every fourth task
     * (as initially concurrencyMax is four) occurs. On turn of every fourth task
     * we send the array of concurrent tasks to resolveConcurrentRequest function
     * who resolve this array of promises in parallel. After this we clear this concurrent task array
     * and set count of concurrent task to zero to resolve another bunch of concurrent tasks.
     * To check current task is every fourth task or not we take reminder of current task count with
     * Max Limit of concurrent task. If Reminder is zero its mean the  current task is the last task of
     * concurrent task array.
     *
     * For Example:
     * Tasks Counts = 1 2 3 4 5 6 7 8 9 10
     * Current Task Count = 4
     * Concurrency Max = 4
     * So Current Task Count % Concurrency Max will return reminder which is equal to zero
     */
    if ((counter + 1) % concurrencyMax == 0) {
      await resolveConcurrentRequest(concurrentTaskList);
      concurrencyCurrent = 0;
      concurrentTaskList = [];
    }
    // }
  }
};

init();
