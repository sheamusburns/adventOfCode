var fs = require('fs');
var csv = require('csv');
var input = csv.stringify(fs.readFileSync('./day07Input.js', 'utf8')).options.split('\n');

var values = {};
var count = 0;
var reWireNames = /[a-z]+/g;
var reOperator = /([A-Z])\w+/g;
var reKey = /[a-z]+$/g;
var reFormula = /^.*(?=\s->)/g;
var operators = {
	AND: '&',
	OR: '|',
	NOT: '~',
	LSHIFT: '<<',
	RSHIFT: '>>'
};

circuitShift(2);

function circuitShift(num) {
	prepArr(input);
	for (var i = 0; i < (num-1); i++){
		prepArr(input, circIt());
	}
	circIt();
}

function prepArr (inputArr, startVal) {
	(values !== {}) ? values = {} : values
	inputArr.forEach(function(item, ind, array){
		if (item.match(reFormula)[0] > -1) {
			values[item.match(reKey)] = Number(item.match(reFormula)[0]);
		} else if (item.match(reOperator)){
			array[ind] = array[ind].replace(reOperator, operators[item.match(reOperator)[0]]);
			values[item.match(reKey)[0]] = array[ind].match(reFormula)[0];	
		} else {
			values[item.match(reKey)[0]] = array[ind].match(reFormula)[0];
		}	
	});
	values.b = (startVal) ? Number(startVal) : values.b;
}

function circIt(){
	count = 0;
	var wires;
	for (obj in values) {
		if (typeof values[obj] === 'string') {
			wires = values[obj].match(reWireNames);
			(wires && wires.length)
			? function(){
				count++
				for (var i = 0; i < wires.length; i++){
					values[obj] = (typeof values[wires[i]] === 'number') ? 
					values[obj].replace(wires[i], values[wires[i]]) :
					values[obj]
				}
			}()
			: values[obj] = eval(values[obj]);
		}
	}
	(count > 0) ? circIt() : console.log("a: %s", values.a);
	return values.a;
}
