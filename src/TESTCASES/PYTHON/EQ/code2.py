def fact(n):
  if n==1 or n==0:
    return n
  return n*fact(n)

print(fact(5))