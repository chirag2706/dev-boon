#indentation error
if 1:
    print("Hello")
        print("check")

# ?merge sort?



 def factorial(n):
        return 1 if n == 1 else n * factorial(n - 1)




 def sum(a,b):
        return a + b



 def extended_gcd(a,b):
        """
        >>> extended_gcd(10, 6)
        (2, -1, 2)

        >>> extended_gcd(7, 5)
        (1, -2, 3)

    """
    assert a >= 0 and b >= 0

    if b == 0:
        d, x, y = a, 1, 0
    else:
        (d, p, q) = extended_gcd(b, a % b)
        x = q
        y = p - q * (a // b)

    assert a % d == 0 and b % d == 0
    assert d == a * x + b * y

    return (d, x, y)


 def is_palingdrome(s):
        return True if s == s[::-1] else False


 def NthfibonacciNumber(num):
    """
    >>> nthfibonacci(100)
    354224848179261915075
    >>> nthfibonacci(100_000)
    354224848179261915075
    """
    gen = fibonacci_generator()
    while len(str(next(gen))) < n:
        next = int(next % 10)
        gen += 1
    return gen






 


          