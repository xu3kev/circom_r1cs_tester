

# This file was *autogenerated* from the file node_modules/circom_r1cs_tester/solver/solve.sage
from sage.all_cmdline import *   # import sage library

_sage_const_1 = Integer(1); _sage_const_21888242871839275222246405745257275088548364400416034343698204186575808495617 = Integer(21888242871839275222246405745257275088548364400416034343698204186575808495617); _sage_const_0 = Integer(0)
set_verbose(-_sage_const_1 )
num = int(input())
eqs = input()
p = _sage_const_21888242871839275222246405745257275088548364400416034343698204186575808495617 
R = PolynomialRing(GF(p), num, 'x')
d = {'x'+str(i):R.gen(i) for i in range(num)}
l = sage_eval(eqs, d)
x0 = R.gen(_sage_const_0 )
l.append(x0-_sage_const_1 )
I = ideal(l)
B = I.groebner_basis()
try:
    ans = ideal(B).variety()
except:
    #print(B)
    print("Error: solutions might Not be unique")
    raise "variety dimension might > 0"
if len(ans)>_sage_const_1 :
    print("Solution Not Unique")
    raise "More than 1"
ans = ans[_sage_const_0 ]
#print(ans)
s = ",".join(['"' + str(k)[_sage_const_1 ::] + '"' +  ': "' + str(v) + '"' for k,v in ans.items()])
print("{" + s + "}")
        

