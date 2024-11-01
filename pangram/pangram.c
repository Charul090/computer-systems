#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>


bool ispangram(char *s) {
  int char_bits = 0;
  // either between 65-90 or 97-122
  while(*s) {
    int lower_diff = *s - 65;
    int higher_diff = *s - 97;
    if (lower_diff >= 0 && lower_diff <= 25) {
      char_bits |= 1 << lower_diff;
    } else if (higher_diff >= 0 && higher_diff <= 25) {
      char_bits |= 1 << higher_diff;
    }
    s++;
  }
  return char_bits == ((2 << 25) - 1);
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
