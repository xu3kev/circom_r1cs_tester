set_verbose(-1)
num = int(input())
eqs = input()
p = 21888242871839275222246405745257275088548364400416034343698204186575808495617
R = PolynomialRing(GF(p), num, 'x')
#print(num)
d = {'x'+str(i):R.gen(i) for i in range(num)}
#print(d)
l = sage_eval(eqs, d)
x0 = R.gen(0)
#l.append(x0-1)
I = ideal(l)
B = I.groebner_basis()
try:
    ans = ideal(B).variety()
except:
    #print(B)
    print("Error: solutions might Not be unique")
    raise "variety dimension might > 0"
if len(ans)>1:
    print("Solution Not Unique")
    raise "More than 1"
#print(B)
#print(ans)
ans = ans[0]
#print('??????')
#print(ans)
#print('??????')
s = ",".join(['"' + str(k)[1::] + '"' +  ': "' + str(v) + '"' for k,v in ans.items()])
print("{" + s + "}")