export interface Vec3 { x:number; y:number; z:number }

export interface PathComponent {
  path: Vec3[];
  currentIndex: number;
}
