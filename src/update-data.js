const https = require("https");
const readline = require("readline");
const fs = require("fs");

// Set the URL of the file to download
const url = "https://www.iana.org/assignments/enterprise-numbers.txt";

const options = {
  headers: {
    "User-Agent": "npm-snmp-pen",
  },
};

const enterpriseNumbers = {};

// Create a new ReadableStream from the URL
const stream = https.get(url, options, (response) => {
  // Create a new readline interface from the response
  const rl = readline.createInterface({
    input: response,
    crlfDelay: Infinity,
  });

  // Define a counter for the line number
  let lineCount = 0;

  // Define variables for each field
  let decimal = "";
  let organization = "";
  let contact = "";
  let email = "";

  // Define a function to be called on each line of the file
  rl.on("line", (line) => {
    if (!(line.startsWith(" ") || /^\d/.test(line))) {
      return;
    }
    lineCount++;
    process.stdout.write(`${lineCount} \r`);

    // Check if the line number is divisible by 4
    if (lineCount % 4 === 1) {
      // Save the decimal field
      decimal = line.trim();
    } else if (lineCount % 4 === 2) {
      // Save the organization field
      organization = line.trim();
    } else if (lineCount % 4 === 3) {
      // Save the contact field
      contact = line.trim();
    } else if (lineCount % 4 === 0) {
      // Save the email field
      email = line.trim();
      enterpriseNumbers[decimal] = organization;
    }
  });
});

// Handle errors
stream.on("error", (err) => {
  writeToFile();
  console.error(`Failed to download file: ${err}`);
});

// Close the write stream when the parsing is finished
stream.on("close", () => {
  writeToFile();
  console.error(`Finished!`);
});

function writeToFile(cb) {
  if (!enterpriseNumbers) {
    return;
  }
  fs.writeFile(
    "./src/enterprise-numbers.json",
    JSON.stringify(enterpriseNumbers, null, 2),
    (err) => {
      if (err) throw err;
      console.log("Data written to file!");
      if (cb) {cb()}
    }
  );
}

process.on("SIGINT", () => {
  console.log("Received SIGINT. Writing data to file...");
  writeToFile(()=> {
    process.exit();
  });
});
