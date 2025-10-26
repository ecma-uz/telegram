const args: { [key: string]: string | undefined } = {};

for (let i = 0; i < process.argv.length; i++) {
  if (process.argv[i].startsWith("--") && process.argv[i + 1]) {
    args[process.argv[i].slice(2)] = process.argv[i + 1];
  }
}

export default args;
