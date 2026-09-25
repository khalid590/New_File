class CacheNode {
  constructor(key, value, ttlMs = null) {
    this.key = key;
    this.value = value;
    this.expiryTime = ttlMs ? Date.now() + ttlMs : null;
    this.prev = null;
    this.next = null;
  }

  isExpired() {
    return this.expiryTime !== null && Date.now() > this.expiryTime;
  }
}

class LRUCache {
  constructor(capacity) {
    if (capacity <= 0) {
      throw new Error("Capacity must be a positive integer.");
    }
    this.capacity = capacity;
    this.map = new Map();

    this.head = new CacheNode(null, null);
    this.tail = new CacheNode(null, null);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key) {
    const node = this.map.get(key);
    if (!node) return -1;

    if (node.isExpired()) {
      this.removeNode(node);
      this.map.delete(key);
      return -1;
    }

    this.moveToHead(node);
    return node.value;
  }

  put(key, value, ttlMs = null) {
    const existingNode = this.map.get(key);

    if (existingNode) {
      existingNode.value = value;
      existingNode.expiryTime = ttlMs ? Date.now() + ttlMs : null;
      this.moveToHead(existingNode);
    } else {
      if (this.map.size >= this.capacity) {
        const lru = this.tail.prev;
        this.removeNode(lru);
        this.map.delete(lru.key);
      }

      const newNode = new CacheNode(key, value, ttlMs);
      this.addNodeToHead(newNode);
      this.map.set(key, newNode);
    }
  }

  addNodeToHead(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  moveToHead(node) {
    this.removeNode(node);
    this.addNodeToHead(node);
  }
}

async function runDemo() {
  console.log("=== 1. Standard LRU Cache Flow ===");
  const cache = new LRUCache(2);

  cache.put("A", 10);
  console.log('put("A", 10)');
  cache.put("B", 20);
  console.log('put("B", 20)');

  console.log('get("A") ->', cache.get("A"));

  cache.put("C", 30);
  console.log('put("C", 30)');

  console.log('get("B") ->', cache.get("B"));
  console.log('get("C") ->', cache.get("C"));
  console.log('get("A") ->', cache.get("A"));

  console.log("\n=== 2. Optional Bonus: TTL Support ===");
  const ttlCache = new LRUCache(2);

  ttlCache.put("tempKey", "activeValue", 1000);
  console.log('put("tempKey", "activeValue", 1000ms)');

  console.log('get("tempKey") immediately ->', ttlCache.get("tempKey"));

  console.log("Waiting 1.2 seconds...");
  await new Promise((resolve) => setTimeout(resolve, 1200));

  console.log('get("tempKey") after TTL ->', ttlCache.get("tempKey"));
}

// executing the demo fucntion:
runDemo();