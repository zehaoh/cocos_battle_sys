import { runDemoSimulation } from './DemoSimulation';

const logs = runDemoSimulation(25);
for (const line of logs) {
  console.log(line);
}
