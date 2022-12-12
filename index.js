//exports.wasm = require("./wasm/tester");
//exports.c = require("./c/tester");

const {path} = require("path");
const { assert } = require("chai");

const child_process = require("child_process");

async function checkConstraints(circuit, witness, input, output){
    //console.log("witness", witness);
    if (!circuit.constraints) await circuit.loadConstraints();
    arr_str = "[";
    const num_orig_var = witness.length - input.length - 1;
    for (let i=0; i<circuit.constraints.length; i++) {
        eqn = checkConstraint(circuit.constraints[i], input.length, output.length);
        if(i!=0)
            arr_str += ",";
        arr_str += eqn
    }
    final_constraint = "1";
    for (let i=0; i < output.length; i++) {
        arr_str += ",";
        console.log("output", output[i]);
        a = "x" + (i + num_orig_var);
        b = "x" + (i + num_orig_var + output.length);
        final_constraint += "* (" + b + " - 1)";
        eqn = '( x' + (i) + '-' + output[i] + ') * ' + a + ' - ' + b;
        arr_str += eqn 
    }
    // final constraint
    arr_str += ',' + final_constraint;
    arr_str += "]";
    //console.log(num_var)
    const num_var = num_orig_var + output.length*2

    console.log(arr_str)

    const result = child_process.spawnSync("sage", ["node_modules/circom_r1cs_tester/solver/solve.sage"], {encoding: 'utf-8', input:num_var+"\n"+arr_str});
    if(result.stderr!=""){
        console.log(result);
        assert(false, result.stdout);
    }
    json_str = result.stdout
    //console.log('-----return------')
    //console.log(json_str);
    sol = JSON.parse(json_str);
    if(sol['basis'] != "[1]"){
        console.log('GB:')
        console.log(sol['basis'])
        assert(false, "the solution is not uniquely equal to the provided output");
    }
    //console.log(sol)
    //for(var i = 0; i < output.length; i++){
    //    console.log(sol[i], output[i]);
    //    //assert(BigInt(sol[i])==output[i]);
    //}
    //console.log("the solution is unique");


    function checkConstraint(constraint, input_size, output_size) {
    
        const F = circuit.F;
        const a = evalLC(constraint[0], input_size, output_size);
        const b = evalLC(constraint[1], input_size, output_size);
        const c = evalLC(constraint[2], input_size, output_size);
        //assert (F.isZero(F.sub(F.mul(a,b), c)), "Constraint doesn't match");
        const eqn = "(" + a + ")" + "*" + "(" + b + ")" + "-" + "(" + c + ")"; 
        return eqn;
    }

    function evalLC(lc, input_size, output_size) {
        const F = circuit.F;
        let v = F.zero;
        let term = "0";
        for (let w in lc){
            if (w == 0){
                term += "+" + lc[w];
            }
            else if(w <= output_size){
                term += "+" + lc[w] + "*" + "x" + (w-1);
                //console.log('??')
                //console.log(output_size)
                //console.log(w)
                //console.log(term)
            }
            else if(w >= output_size + input_size +1)
                term += "+" + lc[w] + "*" + "x" + (w-input_size-1);
            else
                term += "+" + lc[w] + "*" + witness[w];
        }
        return term;
    }
}

exports.checkConstraints = checkConstraints;
