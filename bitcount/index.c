#include <stdio.h>
#include <assert.h>

int bitCount(long long number);

int main(void) {
    assert(bitCount(0) == 0);
    assert(bitCount(1) == 1);
    assert(bitCount(3) == 2);
    assert(bitCount(8) == 1);
    assert(bitCount(0xffffffff) == 32);
}

int bitCount(long long number) {
    int count = 0;

    while (number > 0) {
        int flag = number & 1;
        number = number >> 1;
        if (flag == 1) {
            count++;
        }
    }
    return count;
}
