class Location {
    constructor(name, buildYear){
        this.name = name;
        this.buildYear = buildYear;
    }
}

class Park extends Location {
    constructor(name, buildYear, area, trees) {
        super(name, buildYear);
        this.trees = trees;
        this.area = area;
    }
    calcDensity() {
        return this.trees / this.area;
    } 
    calcAverage(args) {
        let sum = 0;
        for (let arg of args) {
            sum += arg;
        }
        return sum/args.length;
    }
    calc1000() {
        if (this.trees > 1000) {
            console.log(`${this.name} has more than 1000 trees`)
        } else {
            return;
        }
    }
}

class Street extends Location {
    constructor(name, buildYear, howLong, size) {
        super(name, buildYear);
        this.howLong = howLong;
        size ? this.size = size : this.size = "normal";
    }
    calcLength(args) {
        let total = 0;
        for (let arg of args) {
            total += arg;
        }
        const avg = total / args.length;
        return { total, avg }
    }
}

const allParks = [new Park('Green Park', 1987, 0.2, 215),
                 new Park('National Park', 1894, 2.9, 3541),
                 new Park('Oak Park', 1953, 0.4, 949)];

const allStreets = [new Street('Ocean Avenue', 1999, 1.1, 'big'),
                   new Street('Evergreen Street', 2008, 2.7, 'small'),
                   new Street('4th Street', 2015, 0.8),
                   new Street('Sunset Boulevard', 1982, 2.5, 'huge')];

console.log('Parks report:')
let ages = [];
const now = new Date().getFullYear();
allParks.forEach((el) => {
    ages.push(now - el.buildYear);
    el.calc1000();
    console.log(`${el.name} has a tree density of ${el.calcDensity()} trees per square km`)
})
console.log(`Our 3 parks have an average age of ${Park.prototype.calcAverage(ages)} years.`)
console.log('Streets report:')
let lengths = [];
allStreets.forEach(el => {
    console.log(`${el.name}, was built in ${el.buildYear}, and it is a ${el.size} street`)
    lengths.push(el.howLong);
})
const { total, avg } = Street.prototype.calcLength(lengths);
console.log(`The 4 streets have a total length of ${total} km, with an average of ${avg} km per street.`)