const shuffle = array => {
    let currIndex = array.length;
    let randIndex, tempValue;

    while (currIndex !== 0) {
        randIndex = Math.floor(Math.random() * currIndex);
        currIndex -= 1;

        tempValue = array[currIndex];
        array[currIndex] = array[randIndex];
        array[randIndex] = tempValue;
    }

    return array;
};

module.exports = shuffle;
