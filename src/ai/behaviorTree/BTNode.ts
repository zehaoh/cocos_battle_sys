import type { BTContext } from './BTContext';
import { NodeStatus } from './NodeStatus';
export abstract class BTNode { abstract tick(ctx: BTContext): NodeStatus; }
