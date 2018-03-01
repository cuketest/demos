module.exports = class Calculator {
    
    constructor() {
        this.stack = [];
    }

    push(a) {
        this.stack.push(parseInt(a));
    }

    calc(op) {
        if (op == 'add') {
            let sum = 0;
            this.stack.map(a => {
                sum += a;
            });

            this.stack = [];
            return sum;
        }
    } 
}
