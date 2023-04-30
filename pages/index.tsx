// Import necessary packages
import React, { useState } from 'react';
import { PieChart } from 'react-minimal-pie-chart';

// Define the category interface
interface Category {
  name: string;
  rank: number;
  weight?: number;
}

// Define the app component
const App: React.FC = () => {
  // Define the initial state of the categories
  const [categories, setCategories] = useState<Category[]>([
    { name: 'Housing', rank: 1 },
    { name: 'Transportation', rank: 2 },
    { name: 'Food', rank: 3 },
    { name: 'Entertainment', rank: 4 },
    { name: 'Utilities', rank: 5 },
    { name: 'Clothing', rank: 6 },
    { name: 'Other', rank: 7 },
  ]);

  // Define a function to handle changes to the category rankings
  const handleRankChange = (name: string, newRank: number) => {
    // Update the rank of the category
    const newCategories = [...categories];
    const categoryIndex = newCategories.findIndex(
      (category) => category.name === name
    );
    newCategories[categoryIndex].rank = newRank;

    // Sort the categories by rank
    newCategories.sort((a, b) => a.rank - b.rank);

    // Update the state with the new categories
    setCategories(newCategories);
  };

  // Define a function to calculate the weights of the categories using the AHP algorithm
  const calculateWeights = () => {
    // Define the pairwise comparison matrix
    const matrix: number[][] = [
      [1, 3, 5, 7, 9, 7, 5],
      [1 / 3, 1, 3, 5, 7, 5, 3],
      [1 / 5, 1 / 3, 1, 3, 5, 3, 1],
      [1 / 7, 1 / 5, 1 / 3, 1, 3, 1, 1 / 3],
      [1 / 9, 1 / 7, 1 / 5, 1 / 3, 1, 1 / 3, 1 / 5],
      [1 / 7, 1 / 5, 1 / 3, 1, 3, 1, 1 / 3],
      [1 / 5, 1 / 3, 1, 3, 5, 3, 1],
    ];

    // Calculate the row sums of the matrix
    const rowSums = matrix.map((row) => row.reduce((sum, value) => sum + value, 0));

    // Normalize the matrix
    const normalizedMatrix = matrix.map((row, i) =>
      row.map((value) => value / rowSums[i])
    );

    // Calculate the column averages of the normalized matrix
    const columnAverages = normalizedMatrix.reduce(
      (averages, row) =>
        row.map((value, i) => averages[i] + value),
      new Array(categories.length).fill(0)
    ).map((average) => average / categories.length);

    // Calculate the weights of the categories
    const weights = normalizedMatrix.map((row) =>
      row.reduce((sum, value, i) => sum + value * columnAverages[i], 0)
    );

    // Update the state with the new weights
    const newCategories = categories.map((category: any, i: any) => ({
      ...category,
      weight: weights[i],
    }));
    setCategories(newCategories);
  }
  // Render the app
  return (
    <div>
      <h1>Expense Calculator</h1>
      <p>Please rank the following expense categories in order of importance:</p>
      <ol>
        {categories.map((category: { name: string; rank: any; }) => (
          <li key={category.name}>
            <label>
              {category.name}
              <input
                type="number"
                value={category.rank}
                min={1}
                max={categories.length}
                onChange={(event: { target: { value: string; }; }) =>
                  handleRankChange(category.name, parseInt(event.target.value))
                }
              />
            </label>
          </li>
        ))}
      </ol>
      <button onClick={calculateWeights}>Calculate Weights</button>
      {categories.some((category) => !category.weight) ? (
        <p>Please calculate the weights to see the recommended expense percentages.</p>
      ) : (
        <div>
          <PieChart
            data={categories.map((category) => ({
              title: category.name,
              value: category.weight ?? 0,
              color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
            }))}
          />

          {categories.map((category: { name: string; rank: any; weight?: number }) => (
            <li key={category.name}>
              <label>
                {category.name}
                <span>{category.weight ?? 0}</span>
                <span>{category.rank}</span>
                <span>{`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`}</span>
              </label>

            </li>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
