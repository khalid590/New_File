# LRU Cache Implementation

## Overview
--> This project implements a Least Recently Used (LRU) Cache using JavaScript. The cache supports get() and put() operations and removes the least recently used item when the cache reaches its capacity.
I also added optional TTL (Time-To-Live) support as a bonus feature. A key can be given an expiration time, after which get() returns -1 and removes the expired entry.

## Data Structures Used
--> I used two main data structures:

Map — Stores each cache key and its corresponding linked-list node. This allows me to find a key quickly.
Doubly Linked List — Keeps track of the order in which cache items are used.
I used a doubly linked list because a node can be removed or moved to the front in constant time when both prev and next references are available.
The cache uses two dummy nodes, head and tail, to make insertion and removal easier. The node immediately after head is the most recently used item, while the node immediately before tail is the least recently used item.

## How LRU Ordering Is Maintained
--> Whenever a new item is added, it is placed immediately after the head, making it the most recently used item.
When an existing item is accessed using get(), that node is removed from its current position and moved to the front of the linked list.
The same happens when an existing key is updated using put().
For example, with a cache capacity of 2:
put("A", 10)
put("B", 20)
HEAD → B → A → TAIL
        MRU   LRU
If get("A") is called, the order becomes:
HEAD → A → B → TAIL
        MRU   LRU
If a new item C is then added, B is the least recently used item, so it is removed.

## Time Complexity
--> The average time complexity is:
get() → O(1)
put() → O(1)
The Map provides average O(1) lookup, while the doubly linked list allows nodes to be removed and moved to the front in O(1) time

## Space Complexity
-->The space complexity is O(capacity) because the cache stores at most the specified number of entries.
Each entry contains a key, value, expiration information, and links to the previous and next nodes.

## TTL Support
--> As an optional bonus, I added TTL support to the cache.
The put() method can receive a TTL value in milliseconds. The expiration time is stored with the cache node.
For example:
cache.put("tempKey", "activeValue", 1000);
This keeps the item available for approximately 1 second. After the TTL expires, calling get("tempKey") returns -1 and removes the expired item.
One limitation of my TTL implementation is that expired entries are cleaned up when they are accessed through get(). There is no separate background process that continuously removes expired entries.

## Example Output
--> I ran the implementation directly in the terminal. The following output demonstrates the standard LRU flow and the optional TTL feature:

1. Standard LRU Cache Flow ===
put("A", 10)
put("B", 20)
get("A") -> 10
put("C", 30)
get("B") -> -1
get("C") -> 30
get("A") -> 10

2. Optional Bonus: TTL Support ===
put("tempKey", "activeValue", 1000ms)
get("tempKey") immediately -> activeValue
Waiting 1.2 seconds...
get("tempKey") after TTL -> -1

The get("B") -> -1 result shows that B was removed when the cache exceeded its capacity because it was the least recently used entry.

## How to Run
--> Open a terminal in the project directory and run:
node main.js
The program will execute the LRU cache example and the optional TTL example and print the results in the terminal.
