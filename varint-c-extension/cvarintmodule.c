#define PY_SSIZE_T_CLEAN
#include <Python.h>
#include <stdint.h>
#include <string.h>

static PyObject *cvarint_encode(PyObject *self, PyObject *args) {
    uint64_t val;
    char bytes[10];
    int index = 0;

    if (!PyArg_ParseTuple(args, "k", &val)) {
        return NULL;
    }

    while (val > 0) {
        int currAns = val & 127;
        val = val >> 7;
        if (val > 0) {
            currAns |= 128;
        }
        bytes[index] = currAns;
        index++;
    }
    return Py_BuildValue("y#", bytes, index);
}

static PyObject *cvarint_decode(PyObject *self, PyObject *args) {
    const char *byte_string;
    uint64_t ans = 0;
    if (!PyArg_ParseTuple(args, "y", &byte_string)) {
        return NULL;
    }
    int string_len = strlen(byte_string);
    int index = 0;
    while(index < string_len) {
        int shift_bits = index * 7;
        uint64_t currAns = (uint64_t)((byte_string[index]) & 127) << shift_bits;
        ans |= currAns;
        index++;
    }
    return Py_BuildValue("k", ans);
}

static PyMethodDef CVarintMethods[] = {
    {"encode", cvarint_encode, METH_VARARGS, "Encode an integer as varint."},
    {"decode", cvarint_decode, METH_VARARGS,
     "Decode varint bytes to an integer."},
    {NULL, NULL, 0, NULL}};

static struct PyModuleDef cvarintmodule = {
    PyModuleDef_HEAD_INIT, "cvarint",
    "A C implementation of protobuf varint encoding", -1, CVarintMethods};

PyMODINIT_FUNC PyInit_cvarint(void) { return PyModule_Create(&cvarintmodule); }
