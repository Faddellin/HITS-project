export default class Graph
{
    constructor()
    {
        this.vertices = [];
        this.edges = {};
    }

    addVertex(vertex)
    {
        this.vertices.push(vertex);
        this.edges[vertex] = [];
    }

    addEdge(from, to, cost)
    {
        this.edges[from].push({ to, cost });
        this.edges[to].push({ to: from, cost });
    }

    neighbors(vertex)
    {
        return this.edges[vertex].map(edge => edge.to);
    }

    cost(from, to)
    {
        const edge = this.edges[from].find(edge => edge.to === to);
        return edge ? edge.cost : Infinity;
    }
}