#include <stdio.h>
#include <assert.h>
#include <stdint.h>

int bitCount(uint32_t number);

int main(void) {
    assert(bitCount(0) == 0);
    assert(bitCount(1) == 1);
    assert(bitCount(3) == 2);
    assert(bitCount(8) == 1);
    assert(bitCount(0xffffffff) == 32);
}

int bitCount(uint32_t number) {
    int count = 0;

    while (number > 0) {
        count++;
        number &= (number - 1);
    }
    return count;
}
