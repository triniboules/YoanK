const fs = require('fs');
const axios = require('axios');

// Define the path to the database file
const databasePath = './database.json';

// Function to load the database
function loadDatabase() {
    if (fs.existsSync(databasePath)) {
        const data = fs.readFileSync(databasePath);
        return JSON.parse(data);
    }
    return { project: { name: "yoank", data: {} } }; // Initialize if not exists
}

// Function to save the updated database
function saveDatabase(data) {
    fs.writeFileSync(databasePath, JSON.stringify(data, null, 2));
}

// Function to run a model
async function runModel(modelName, input) {
    const response = await axios.post(`http://localhost:XXXX/api/${modelName}`, {
        prompt: input,
    });
    return response.data;
}

// Main function to handle interactions
async function main() {
    const database = loadDatabase();

    // Main loop for user interaction
    while (true) {
        const userInput = prompt("User: ");
        if (userInput.toLowerCase() === 'exit') break;

        // Choose the model based on user input
        let modelName = 'llama3.2'; // Default model
        if (userInput.includes("code")) {
            modelName = 'qwen2.5-coder'; // Use Qwen for code-related inputs
        }

        // Run the appropriate model
        const modelResponse = await runModel(modelName, userInput);
        console.log(`Response from ${modelName}:`, modelResponse);

        // Update the database with the response
        database.project.data[modelResponse.id] = modelResponse;
        saveDatabase(database);
    }
}

main().catch(console.error);
