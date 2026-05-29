
import { useEffect, useState } from "react";

export default function SortingVisualizer() {
  const [array, setArray] = useState([]);
  const [arraySize, setArraySize] = useState(40);
  const [speed, setSpeed] = useState(40);
  const [isSorting, setIsSorting] = useState(false);
  const [algorithm, setAlgorithm] = useState("Bubble Sort");
  const [activeBars, setActiveBars] = useState([]);
  const [sortedBars, setSortedBars] = useState([]);

  useEffect(() => {
    generateArray();
  }, [arraySize]);

  const sleep = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const generateArray = () => {
    const newArray = [];

    for (let i = 0; i < arraySize; i++) {
      newArray.push(Math.floor(Math.random() * 400) + 20);
    }

    setArray(newArray);
    setSortedBars([]);
    setActiveBars([]);
  };

  // Bubble Sort
  const bubbleSort = async () => {
    const arr = [...array];

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        setActiveBars([j, j + 1]);

        await sleep(110 - speed);

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
        }
      }

      setSortedBars((prev) => [...prev, arr.length - i - 1]);
    }

    setActiveBars([]);
  };

  // Insertion Sort
  const insertionSort = async () => {
    const arr = [...array];

    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;

      while (j >= 0 && arr[j] > key) {
        setActiveBars([j, j + 1]);

        arr[j + 1] = arr[j];
        setArray([...arr]);

        await sleep(110 - speed);
        j--;
      }

      arr[j + 1] = key;
      setArray([...arr]);
    }

    setSortedBars(arr.map((_, i) => i));
    setActiveBars([]);
  };

  // Selection Sort
  const selectionSort = async () => {
    const arr = [...array];

    for (let i = 0; i < arr.length; i++) {
      let minIndex = i;

      for (let j = i + 1; j < arr.length; j++) {
        setActiveBars([minIndex, j]);

        await sleep(110 - speed);

        if (arr[j] < arr[minIndex]) {
          minIndex = j;
        }
      }

      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      setArray([...arr]);

      setSortedBars((prev) => [...prev, i]);
    }

    setActiveBars([]);
  };

  // Merge Sort
  const mergeSort = async () => {
    const arr = [...array];

    const merge = async (left, mid, right) => {
      const leftArr = arr.slice(left, mid + 1);
      const rightArr = arr.slice(mid + 1, right + 1);

      let i = 0;
      let j = 0;
      let k = left;

      while (i < leftArr.length && j < rightArr.length) {
        setActiveBars([k]);

        await sleep(110 - speed);

        if (leftArr[i] <= rightArr[j]) {
          arr[k] = leftArr[i];
          i++;
        } else {
          arr[k] = rightArr[j];
          j++;
        }

        setArray([...arr]);
        k++;
      }

      while (i < leftArr.length) {
        arr[k] = leftArr[i];
        i++;
        k++;

        setArray([...arr]);
        await sleep(110 - speed);
      }

      while (j < rightArr.length) {
        arr[k] = rightArr[j];
        j++;
        k++;

        setArray([...arr]);
        await sleep(110 - speed);
      }
    };

    const mergeSortHelper = async (left, right) => {
      if (left >= right) return;

      const mid = Math.floor((left + right) / 2);

      await mergeSortHelper(left, mid);
      await mergeSortHelper(mid + 1, right);

      await merge(left, mid, right);
    };

    await mergeSortHelper(0, arr.length - 1);

    setSortedBars(arr.map((_, i) => i));
    setActiveBars([]);
  };

  // Quick Sort
  const quickSort = async () => {
    const arr = [...array];

    const partition = async (low, high) => {
      const pivot = arr[high];
      let i = low - 1;

      for (let j = low; j < high; j++) {
        setActiveBars([j, high]);

        await sleep(110 - speed);

        if (arr[j] < pivot) {
          i++;

          [arr[i], arr[j]] = [arr[j], arr[i]];
          setArray([...arr]);
        }
      }

      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      setArray([...arr]);

      return i + 1;
    };

    const quickSortHelper = async (low, high) => {
      if (low < high) {
        const pi = await partition(low, high);

        await quickSortHelper(low, pi - 1);
        await quickSortHelper(pi + 1, high);
      }
    };

    await quickSortHelper(0, arr.length - 1);

    setSortedBars(arr.map((_, i) => i));
    setActiveBars([]);
  };

  const startSorting = async () => {
    setIsSorting(true);
    setSortedBars([]);

    if (algorithm === "Bubble Sort") {
      await bubbleSort();
    } else if (algorithm === "Insertion Sort") {
      await insertionSort();
    } else if (algorithm === "Selection Sort") {
      await selectionSort();
    } else if (algorithm === "Merge Sort") {
      await mergeSort();
    } else if (algorithm === "Quick Sort") {
      await quickSort();
    }

    setIsSorting(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Sorting Visualizer
          </h1>

          <p className="text-slate-400 text-lg">
            Visualize classic sorting algorithms with real animations.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <section className="lg:col-span-1 bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl">
            <h2 className="text-2xl font-semibold mb-6">Controls</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Array Size : {arraySize}
                </label>

                <input
                  type="range"
                  min="10"
                  max="100"
                  value={arraySize}
                  disabled={isSorting}
                  onChange={(e) => setArraySize(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Speed : {speed}
                </label>

                <input
                  type="range"
                  min="1"
                  max="100"
                  value={speed}
                  disabled={isSorting}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Algorithm
                </label>

                <select
                  value={algorithm}
                  disabled={isSorting}
                  onChange={(e) => setAlgorithm(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none"
                >
                  <option>Bubble Sort</option>
                  <option>Insertion Sort</option>
                  <option>Selection Sort</option>
                  <option>Merge Sort</option>
                  <option>Quick Sort</option>
                </select>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button
                  disabled={isSorting}
                  onClick={generateArray}
                  className="bg-cyan-500 hover:bg-cyan-600 transition rounded-2xl py-3 font-semibold disabled:opacity-50"
                >
                  Generate Array
                </button>

                <button
                  disabled={isSorting}
                  onClick={startSorting}
                  className="bg-blue-600 hover:bg-blue-700 transition rounded-2xl py-3 font-semibold disabled:opacity-50"
                >
                  {isSorting ? "Sorting..." : "Start Sorting"}
                </button>
              </div>
            </div>

            <div className="mt-8 bg-slate-800 rounded-2xl p-4 border border-slate-700">
              <h3 className="font-semibold mb-3">Legend</h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-cyan-400"></div>
                  <span className="text-slate-300">Default Bars</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-500"></div>
                  <span className="text-slate-300">Currently Comparing</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-500"></div>
                  <span className="text-slate-300">Sorted Elements</span>
                </div>
              </div>
            </div>
          </section>

          <section className="lg:col-span-3 bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">
                  Visualization Area
                </h2>

                <p className="text-slate-400 text-sm mt-1">
                  Algorithm : {algorithm}
                </p>
              </div>

              <div className="bg-slate-800 px-4 py-2 rounded-xl border border-slate-700">
                <span className="text-green-400 font-semibold">
                  {isSorting ? "Running" : "Ready"}
                </span>
              </div>
            </div>

            <div className="h-[550px] bg-slate-950 rounded-3xl border border-slate-800 p-4 flex items-end justify-center gap-[2px] overflow-hidden">
              {array.map((value, index) => {
                let barColor = "bg-cyan-400";

                if (activeBars.includes(index)) {
                  barColor = "bg-red-500";
                }

                if (sortedBars.includes(index)) {
                  barColor = "bg-green-500";
                }

                return (
                  <div
                    key={index}
                    className={`${barColor} rounded-t-md transition-all duration-100`}
                    style={{
                      height: `${value}px`,
                      width: `${Math.max(1000 / array.length, 6)}px`,
                    }}
                  ></div>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

