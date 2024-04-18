export default class PriorityQueue
{
    constructor()
    {
        this._data = [];
    }
    enqueue(v, priority)
    {
        this._data.push({ value: v, priority: priority });
        this._data.sort((a, b) => a.priority - b.priority);
    }
    dequeue(v)
    {
        return this._data.shift().value;
    }
    isEmpty()
    {
        return this._data.length === 0;
    }
}