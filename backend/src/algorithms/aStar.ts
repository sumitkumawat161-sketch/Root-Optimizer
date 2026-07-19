import { GeoPoint, haversineDistanceKm } from "./nearestNeighbor";

export interface AStarEdge {
  to: string;
  weight: number;
}

export type AStarGraph = Record<string, AStarEdge[]>;

export interface AStarResult {
  path: string[];
  distanceKm: number;
}

class PriorityQueue {
  private items: { node: string; priority: number }[] = [];

  enqueue(node: string, priority: number) {
    this.items.push({ node, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }

  dequeue(): string | undefined {
    return this.items.shift()?.node;
  }

  get isEmpty() {
    return this.items.length === 0;
  }
}

export function aStar(
  graph: AStarGraph,
  nodeCoords: Record<string, GeoPoint>,
  source: string,
  target: string
): AStarResult {
  const openSet = new PriorityQueue();
  openSet.enqueue(source, 0);

  const cameFrom: Record<string, string | null> = { [source]: null };
  const gScore: Record<string, number> = { [source]: 0 };

  const heuristic = (a: string, b: string) =>
    haversineDistanceKm(nodeCoords[a], nodeCoords[b]);

  const visited = new Set<string>();

  while (!openSet.isEmpty) {
    const current = openSet.dequeue()!;
    if (current === target) break;
    if (visited.has(current)) continue;
    visited.add(current);

    const edges = graph[current] || [];
    for (const edge of edges) {
      const tentativeG = (gScore[current] ?? Infinity) + edge.weight;
      if (tentativeG < (gScore[edge.to] ?? Infinity)) {
        cameFrom[edge.to] = current;
        gScore[edge.to] = tentativeG;
        const fScore = tentativeG + heuristic(edge.to, target);
        openSet.enqueue(edge.to, fScore);
      }
    }
  }

  const path: string[] = [];
  let node: string | null | undefined = target;
  while (node !== null && node !== undefined) {
    path.unshift(node);
    node = cameFrom[node];
  }

  if (path[0] !== source) {
    return { path: [], distanceKm: Infinity };
  }

  return { path, distanceKm: gScore[target] ?? Infinity };
}
