export interface ProjectileBehavior
{
 onSpawn():void
 onUpdate(dt:number):void
 onHit(target:number):void
}
