export interface WeightedEdge {
  to: string;
  weight: number;
}

export type Graph = Record<string, WeightedEdge[]>;

export interface DijkstraResult {
  distances: Record<string, number>;
  path: string[];
}

class MinHeap {
  private heap: { node: string; dist: number }[] = [];

  push(item: { node: string; dist: number }) {
    this.heap.push(item);
    this.bubbleUp(this.heap.length - 1);
  }

  pop(): { node: string; dist: number } | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }
    return top;
  }

  get size() {
    return this.heap.length;
  }

  private bubbleUp(idx: number) {
    while (idx > 0) {
      const parent = Math.floor((idx - 1) / 2);
      if (this.heap[parent].dist <= this.heap[idx].dist) break;
      [this.heap[parent], this.heap[idx]] = [this.heap[idx], this.heap[parent]];
      idx = parent;
    }
  }

  private bubbleDown(idx: number) {
    const n = this.heap.length;
    while (true) {
      let smallest = idx;
      const left = 2 * idx + 1;
      const right = 2 * idx + 2;
      if (left < n && this.heap[left].dist < this.heap[smallest].dist) smallest = left;
      if (right < n && this.heap[right].dist < this.heap[smallest].dist) smallest = right;
      if (smallest === idx) break;
      [this.heap[smallest], this.heap[idx]] = [this.heap[idx], this.heap[smallest]];
      idx = smallest;
    }
  }
}

export function dijkstra(graph: Graph, source: string, target: string): DijkstraResult {
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const visited = new Set<string>();
  const heap = new MinHeap();

  for (const node of Object.keys(graph)) {
    distances[node] = Infinity;
    previous[node] = null;
  }
  distances[source] = 0;
  heap.push({ node: source, dist: 0 });

  while (heap.size > 0) {
    const current = heap.pop()!;
    if (visited.has(current.node)) continue;
    visited.add(current.node);

    if (current.node === target) break;

    const edges = graph[current.node] || [];
    for (const edge of edges) {
      const newDist = distances[current.node] + edge.weight;
      if (newDist < distances[edge.to]) {
        distances[edge.to] = newDist;
        previous[edge.to] = current.node;
        heap.push({ node: edge.to, dist: newDist });
      }
    }
  }

  const path: string[] = [];
  let node: string | null = target;
  while (node) {
    path.unshift(node);
    node = previous[node];
  }

  if (path[0] !== source) {
    return { distances, path: [] };
  }

  return { distances, path };
}
