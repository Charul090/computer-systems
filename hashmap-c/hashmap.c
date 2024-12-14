#include <assert.h>
#include <stdio.h>
#include <string.h>
#include <math.h>
#include <stdlib.h>

#define STARTING_BUCKETS 8
#define MAX_KEY_SIZE 32

typedef struct Item {
  void* value;
  char* key;
  struct Item* next;
} Item;

typedef struct Hashmap {
  Item** items;
  int length;
} Hashmap;

__uint32_t getHashedValue(char* string, int window) {
  __uint32_t string_to_int = 5381;
  int string_len = strlen(string);
  for(int i = 0; i < string_len;i++) {
    string_to_int = (string_to_int * 33) + string[i];
  }

  double int_part;
  double x = modf(((double) string_to_int) * 0.12397, &int_part);

  return floor(x * ((double) window));
}

void* Hashmap_get(Hashmap *h, char* string) {
  int index = getHashedValue(string, h->length);
  const Item* item = h->items[index];
  while(item) {
    if (strcmp(string, item->key) == 0) {
      break;
    }
    item = item->next;
  }
  if (item) {
    return item->value;
  }
}

void* Hashmap_set(Hashmap *h, char* string, void* addr) {
  int index = getHashedValue(string, h->length);
  if (!h->items[index]) {
    Item* items = malloc(sizeof(Item));
    items -> key = strdup(string); 
    items -> value = addr;
    items -> next = NULL;
    h->items[index] = items;
  } else {
    Item *prev = 0;
    Item *item = h->items[index];
    while(item) {
      if (strcmp(string, item->key) == 0) {
        break;
      }
      prev = item;
      item = item->next;
    }
    if(!item) {
      Item* items = malloc(sizeof(Item));
      items -> key = strdup(string); 
      items -> value = addr; 
      items -> next = NULL;
      if (prev != 0) {
        prev->next = items;
      } else {
        h->items[index] = items;
      }
    } else {
      item->value = addr;
    }
  }
}

void Hashmap_delete(Hashmap *h, char* key) {
  int index = getHashedValue(key, h->length);
  Item** item = &(h->items[index]);
  while(item) {
    if (strcmp(key, (*item)->key) == 0) {
      Item* curr = *item;
      *item = (*item)->next;
      free(curr->key);
      free(curr);
      break;
    }
    item = &(*item)->next;
  }
}

void Hashmap_free(Hashmap *h) {
  for(int i = 0; i < h->length;i++) {
    Item* item = h->items[i];
    while (item) {
      Item* curr = item;
      item = item->next;
      free(curr->key);
      free(curr);
    }
  }
  free(h->items);
  free(h);
}

Hashmap* Hashmap_new () {
  Item** item = calloc(MAX_KEY_SIZE, sizeof(void*));
  Hashmap* h = malloc(sizeof(Hashmap)); 
  h->length = STARTING_BUCKETS;
  h->items = item;

  return h;
}

int main() {
  Hashmap *h = Hashmap_new();

  // basic get/set functionality
  int a = 5;
  float b = 7.2;
  Hashmap_set(h, "item a", &a);
  Hashmap_set(h, "item b", &b);
  assert(Hashmap_get(h, "item a") == &a);
  assert(Hashmap_get(h, "item b") == &b);

  // using the same key should override the previous value
  int c = 20;
  Hashmap_set(h, "item a", &c);
  assert(Hashmap_get(h, "item a") == &c);

  // basic delete functionality
  Hashmap_delete(h, "item a");
  assert(Hashmap_get(h, "item a") == NULL);

  // handle collisions correctly
  // note: this doesn't necessarily test expansion
  int i, n = STARTING_BUCKETS * 10, ns[n];
  char key[MAX_KEY_SIZE];
  for (i = 0; i < n; i++) {
    ns[i] = i;
    sprintf(key, "item %d", i);
    Hashmap_set(h, key, &ns[i]);
  }
  for (i = 0; i < n; i++) {
    sprintf(key, "item %d", i);
    assert(Hashmap_get(h, key) == &ns[i]);
  }

  Hashmap_free(h);
  /*
     stretch goals:
     - expand the underlying array if we start to get a lot of collisions
     - support non-string keys
     - try different hash functions
     - switch from chaining to open addressing
     - use a sophisticated rehashing scheme to avoid clustered collisions
     - implement some features from Python dicts, such as reducing space use,
     maintaing key ordering etc. see https://www.youtube.com/watch?v=npw4s1QTmPg
     for ideas
     */
  printf("ok\n");
}
