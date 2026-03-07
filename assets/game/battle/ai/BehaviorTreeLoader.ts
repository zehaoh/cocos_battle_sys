import { BehaviorTree } from './BehaviorTree/BehaviorTree';
import { ActionNode } from './BehaviorTree/ActionNode';
import { ConditionNode } from './BehaviorTree/ConditionNode';
import { CooldownDecorator } from './BehaviorTree/DecoratorNode';
import { NodeStatus, type BehaviorNode } from './BehaviorTree/BehaviorNode';
import { SelectorNode } from './BehaviorTree/SelectorNode';
import { SequenceNode } from './BehaviorTree/SequenceNode';
import type { AIContext } from './AIContext';

export interface BehaviorTreeJSON {
  type: string;
  name?: string;
  cooldown?: number;
  children?: BehaviorTreeJSON[];
}

export class BehaviorTreeLoader {
  public static fromJSON(json: BehaviorTreeJSON): BehaviorTree {
    return new BehaviorTree(this.createNode(json));
  }

  private static createNode(json: BehaviorTreeJSON): BehaviorNode {
    if (json.type === 'Selector') {
      const node = new SelectorNode();
      for (const child of json.children ?? []) node.addChild(this.createNode(child));
      return node;
    }

    if (json.type === 'Sequence') {
      const node = new SequenceNode();
      for (const child of json.children ?? []) node.addChild(this.createNode(child));
      return node;
    }

    if (json.type === 'Decorator') {
      const node = new CooldownDecorator(json.cooldown ?? 0.5);
      for (const child of json.children ?? []) node.addChild(this.createNode(child));
      return node;
    }

    if (json.type === 'Condition') {
      return new ConditionNode(this.resolveCondition(json.name));
    }

    return new ActionNode(this.resolveAction(json.name));
  }

  private static resolveCondition(name?: string): (ctx: AIContext) => boolean {
    if (name === 'ShouldRetreat') return (ctx) => ctx.shouldRetreat;
    if (name === 'HasTarget') return (ctx) => ctx.hasTarget;
    if (name === 'TargetInRange') return (ctx) => ctx.canAttack;
    return () => false;
  }

  private static resolveAction(name?: string): (ctx: AIContext) => NodeStatus {
    if (name === 'Retreat') {
      return (ctx) => {
        ctx.setState('Retreat');
        ctx.setMoveTarget(ctx.position.x - 2, ctx.position.y - 2);
        return NodeStatus.SUCCESS;
      };
    }

    if (name === 'Attack') {
      return (ctx) => {
        ctx.setState('Attack');
        return NodeStatus.SUCCESS;
      };
    }

    if (name === 'Chase') {
      return (ctx) => {
        if (!ctx.hasTarget) return NodeStatus.FAILURE;
        const pos = ctx.blackboard.get<{ x: number; y: number }>('targetPos');
        if (!pos) return NodeStatus.FAILURE;
        ctx.setState('Chase');
        ctx.setMoveTarget(pos.x, pos.y);
        return NodeStatus.SUCCESS;
      };
    }

    return (ctx) => {
      ctx.setState('Idle');
      return NodeStatus.SUCCESS;
    };
  }
}
