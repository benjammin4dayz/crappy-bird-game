interface Dimensions {
  width: number;
  height: number;
}
interface Position {
  x: number;
  y: number;
}

interface GameActorBird extends Position, Dimensions {}
interface GameObstaclePipe extends Position, Dimensions {
  scored?: boolean;
}

export type { Dimensions, Position, GameActorBird, GameObstaclePipe };
