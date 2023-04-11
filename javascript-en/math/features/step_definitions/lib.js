
class MathLib {
    constructor() {
        this._variable = 0;
    }

    setTo (number) {
        this._variable = parseInt(number);
    }

    incrementBy(number) {
        this._variable += parseInt(number);
    }

    get variable() {
        return this._variable;
    }

}

module.exports = new MathLib();