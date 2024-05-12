const isSorted = (array) => {
    for (let i = 1; i < array.length; i++) {
        if (array[i - 1] > array[i]) {
            return false;
        }
    }
    return true;
};

const isMaxHeap = (array) => {
    for (let i = 1; i < array.length; i++) {
        if (array[Math.floor((i - 1) / 2)] < array[i]) {
            return false;
        }
    }
    return true;
};

async function bubbleSort(arr) {
    let compare = true;
    while (compare === true && running) {
        compare = false;
        for (let i = 0; i < arr.length - 1 && running; i++) {
            // swap
            if (arr[i] > arr[i + 1]) {
                compare = true;
                // swap
                swap(i, i + 1);
                drawBar(i, array[i], "#6017df");
                drawBar(i + 1, array[i + 1], "#6017df");
                await sleep();
            }
            drawArray();
        }
    }

    return arr;
}

async function selectionSort(arr) {
    // algorithm works by selecting the minimum element in i...n and swapping
    for (let i = 0; i < arr.length && running; i++) {
        let minDex = i;
        for (let j = i + 1; j < arr.length && running; j++) {
            drawArray();
            drawBar(minDex, array[minDex], "#6017df");
            if (arr[minDex] > arr[j]) {
                // update smallest element
                minDex = j;

                drawBar(minDex, array[minDex], "#6017df");
                // await sleep();
            }
            await sleep();
        }

        // swap i with minDex
        drawArray();
        drawBar(i, array[i], "#6017df");
        drawBar(minDex, array[minDex], "#6017df");
        swap(i, minDex);
        await sleep();
        drawArray();
    }

    return arr;
}

async function insertionSort(arr) {
    for (let i = 1; i < arr.length && running; i++) {
        // start at first index
        let j = i;
        while (running &&
            j > 0 && arr[j - 1] > arr[j]
        ) {
            drawArray();
            drawBar(j - 1, arr[j - 1], "#6017df");
            drawBar(j, arr[j], "#6017df");
            swap(j - 1, j);
            await sleep();

            j--;
        }
    }

    return arr;
}

async function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        let pi = await partition(arr, low, high);

        await Promise.all([
            quickSort(arr, low, pi - 1),
            quickSort(arr, pi + 1, high)
        ]);
    }
    return arr;
}

async function partition(arr, low, high) {
    let pivot = arr[high];
    let i = low - 1;

    for (let j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(i, j);
            drawBar(i, arr[i], "#6017fd"); // Highlight the compared bar in red
            drawBar(j, arr[j], "#6017fd");
            await sleep();
        }
    }

    swap(i + 1, high);
    drawArray(); // Draw the array after each swap
    await sleep();

    return i + 1;
}

async function heapSort(arr) {
    const getLeftIndex = (index) => {
        return index * 2 + 1 < arr.length ? index * 2 + 1 : -1;
    };

    const getRightIndex = (index) => {
        return index * 2 + 2 < arr.length ? index * 2 + 2 : -1;
    };

    const getParentIndex = (index) => {
        return index != 0 ? Math.floor((index - 1) / 2) : -1;
    };

    // construct maxheap: swim up for each index
    for (let index = 1; index < arr.length && running; index++) {
        let parentIndex = getParentIndex(index);
        // swim up until we find place in Max-Heap
        while (running &&
            parentIndex != -1 && arr[parentIndex] < arr[index]
        ) {
            // do the swap and update the value
            // console.log(parentIndex, index);

            drawArray();
            drawBar(index, arr[index], "#6017df");
            drawBar(parentIndex, arr[parentIndex], "#6017df");

            swap(parentIndex, index);
            await sleep();
            drawArray();

            // info for next iteration
            index = parentIndex;
            parentIndex = getParentIndex(index);
        }
    }

    // removeMax and re-establish heap
    for (let i = arr.length - 1; running && i > 0; i--) {
        // swap maxNode with end of the heap
        drawArray();
        drawBar(0, arr[0], "#6017df");
        drawBar(i, arr[i], "#6017df");

        swap(0, i);
        await sleep();
        drawArray();

        // utility functions to get left and right children
        const getLeftChild = (index) => {
            return index * 2 + 1 < i ? arr[index * 2 + 1] : -1;
        };
        const getRightChild = (index) => {
            return index * 2 + 2 < i ? arr[index * 2 + 2] : -1;
        };

        // sink down the node until in the correct position
        let index = 0;
        while (running &&
            getLeftIndex(index) < i && // heap has at least 1 child node (left firs always)
            (arr[index] < getLeftChild(index, i) ||
                arr[index] < getRightChild(index, i))
        ) {
            // swap index with larger of two children
            let newIndex =
                getLeftChild(index, i) > getRightChild(index, i) ?
                getLeftIndex(index) :
                getRightIndex(index);

            drawArray();
            drawBar(index, arr[index], "#6017df");
            drawBar(newIndex, arr[newIndex], "#6017df");

            swap(index, newIndex);
            await sleep();
            drawArray();

            index = newIndex;
        }
    }

    return arr;
}

async function mergeSort(arr) {
    array = arr;
    drawArray(arr);
    let sorted_arr = await recursiveMergeSort(arr, 0);
    return sorted_arr;
}

async function recursiveMergeSort(arr, shift) {
    if (arr.length <= 1) {
        return arr;
    }

    const half = Math.ceil(arr.length / 2);
    let [left, right] = await Promise.all([
        recursiveMergeSort(arr.slice(0, half), 0),
        recursiveMergeSort(arr.slice(half), half),
    ]);

    let [leftIndex, rightIndex] = [0, 0];

    // ALGO: construct new array from min btwn left and right at each index
    for (let i = 0; i < arr.length && running; i++) {
        // update the recursive array representation, and get the index we'll swap
        if (leftIndex == left.length || right[rightIndex] < left[leftIndex]) {
            // index will be left + rightIndex of overall array
            arr[i] = right[rightIndex];
            rightIndex++;
        } else if (
            rightIndex == right.length ||
            left[leftIndex] <= right[rightIndex]
        ) {
            arr[i] = left[leftIndex];
            leftIndex++;
        }

        // internal array indices
        const shiftI = shift + i;

        // we have to directly overwrite the array in order for it to show
        await sleep();
        array[shiftI] = arr[i];
        drawBar(shiftI, arr[i], "#6017df");
        await sleep();
        drawArray();
    }

    return arr;
}

function test() {
    rand_arr = [];
    let s = 10;
    let maxVal = 100;
    // build random array
    for (let i = 0; i < s; i++) {
        rand_arr.push(Math.floor(Math.random() * maxVal));
    }

    // test sorting algo
    mergeSort(rand_arr).then((result) => {
        console.log(result);
        console.log(isSorted(result));
    });
}