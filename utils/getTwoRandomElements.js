export default function getTwoRandomElements(array) {
  if (array.length < 2) {
    throw new Error("The array must have at least two elements.");
  }

  const firstIndex = Math.floor(Math.random() * array.length);
  let secondIndex;

  do {
    secondIndex = Math.floor(Math.random() * array.length);
  } while (secondIndex === firstIndex);

  return [array[firstIndex], array[secondIndex]];
}