#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

#define MASK 0x7fffffe

bool ispangram(char *s) {
  // since the difference between the lowercase and uppercase alphabet's ascii value is 32, char_bits will maintain 32 bits
  // and characters with ascii value lying between 64 and 127 will be masked with 31 to gets position withing 32 bit and that bit will be set
  // the string will be pangram if bits 1 to 25 are set to 1. 0 & 26-31 are not relevant bits for pangram
  // (hence the char_bits will be masked with 0x7fffffe to check if 1 to 25th bits are set or not).
  int char_bits = 0;

  while(*s != '\0') {
    if (*s >= '@' && *s <= 127) {
      char_bits |= 1 << (*s & 0x1f);
    }
    s++;
  }

  return (char_bits & MASK) == MASK;
}

int main() {
  size_t len;
  ssize_t read;
  char *line = NULL;
  while ((read = getline(&line, &len, stdin)) != -1) {
    if (ispangram(line))
      printf("%s", line);
  }

  if (ferror(stdin))
    fprintf(stderr, "Error reading from stdin");

  free(line);
  fprintf(stderr, "ok\n");
}
