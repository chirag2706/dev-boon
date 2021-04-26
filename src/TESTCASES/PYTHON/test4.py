# name error

# snippet from https://stackoverflow.com/questions/7063697/why-is-my-mergesort-so-slow-in-python 
def nolenmerge(array1,array2):
    merged_array=[]
    while array1 or array2:
        if not array1:
            merged_array.append(array2.pop(0))
        elif (not array2) or array1[0] < array2[0]:
            merged_array.append(array1.pop(0))
        else:
            merged_array.append(array2.pop(0))
    return merged_array

def nolenmergeSort(array):
    n  = len(array)
    if n <= 1:
        return array
    left = array[:n/2]
    right = array[n/2:]
    return nolenmerge(nolenmergeSort(left),nolenmergeSort(right))

# snippet from https://stackoverflow.com/questions/7063697/why-is-my-mergesort-so-slow-in-python 
def nolenmerge(array1,array2):
    merged_array=[]
    while array1 or array2:
        if not array1:
            merged_array.append(array2.pop(0))
        elif (not array2) or array1[0] < array2[0]:
            merged_array.append(array1.pop(0))
        else:
            merged_array.append(array2.pop(0))
    return merged_array

def nolenmergeSort(array):
    n  = len(array)
    if n <= 1:
        return array
    left = array[:n/2]
    right = array[n/2:]
    return nolenmerge(nolenmergeSort(left),nolenmergeSort(right))



printt("Hello")