var budgetController = (function(){
    
    var Income = function(id, description, amount){
        this.id = id;
        this.description = description;
        this.amount = amount;
    }
    
    var Expense = function(id, description, amount){
        this.id = id;
        this.description = description;
        this.amount = amount;
        this.percentage = -1;
    }

    Expense.prototype.calcPercentage = function (totalInc) {
        if (totalInc > 0) {
            this.percentage = Math.round((this.amount / totalInc) * 100);
        } else {
            this.percentage = -1;
        }
    }

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(element){
            sum += element.amount;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percent: -1
    }

    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            
            if(data.allItems[type].length){
                ID = (data.allItems[type][data.allItems[type].length-1].id + 1) || 0;
            } else {
                ID = 0;
            }

            if (type === 'exp'){
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            data.allItems[type].push(newItem);
            return newItem;
        },
        deleteItem: function(id, type) {
            var ids, index;
            ids = data.allItems[type].map(function(element){
                return element.id;
            });
            index = ids.indexOf(id);
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },
        calcBudget: function() {
            calculateTotal('inc');
            calculateTotal('exp');
            data.budget = data.totals.inc - data.totals.exp;
            if (data.totals.inc > 0){
                data.percent = Math.round((data.totals.exp/data.totals.inc) * 100);
            } else {
                data.percent = -1;
            }
        },
        calcPercentages: function () {

            data.allItems.exp.forEach(function(element){
                element.calcPercentage(data.totals.inc);
            });

        },
        getPercentages: function () {
            var allPerc = data.allItems.exp.map(function(element){
                return element.getPercentage();
            });
            return allPerc;
        },
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percent: data.percent
            }
        },
        testing: function(){
            return data;
        }
    }

})();

var UIController = (function(){
    const DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        expenseList: '.expenses__list',
        incomeList: '.income__list',
        budgetDisplay: '.budget__value',
        totalIncDisplay: '.budget__income--value',
        totalExpDisplay: '.budget__expenses--value',
        expPercent: '.budget__expenses--percentage',
        container: '.container',
        expensePercentageInd: '.item__percentage',
        dateLabel: '.budget__title--month'
    }

    var formatNumber = function(num, type) {
        var numSplit, int, dec;
        // absolute number & 2 decimals
        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');

        int = numSplit[0];

        if (int.length > 3) {
            int = int.substr(0, int.length -3) + ',' + int.substr(int.length - 3, int.length - 1);
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    
    var nodeListForEach = function(list, callback){
        for (let i=0;i<list.length;i++){
            callback(list[i], i);
        }
    };

    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value, //inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: function(obj, type){
            var html, newHtml, element;
            if (type === 'inc'){
                element = document.querySelector(DOMstrings.incomeList);
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp'){
                element = document.querySelector(DOMstrings.expenseList);
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.amount, type));            
            
            element.insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: function () {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription+', '+DOMstrings.inputValue);
            
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(field){
                field.value = '';
            });

            fieldsArr[0].focus();
        },

        deleteItem: function (selectorID) {

            var selected;
            selected = document.getElementById(selectorID);
            selected.parentNode.removeChild(selected);

        },

        displayBudget: function(budget, totalInc, totalExp, percent){
            let type;

            budget > 0 ? type = 'inc' : type = 'exp'

            document.querySelector(DOMstrings.budgetDisplay).textContent = formatNumber(budget, type);
            document.querySelector(DOMstrings.totalIncDisplay).textContent = formatNumber(totalInc, 'inc');
            document.querySelector(DOMstrings.totalExpDisplay).textContent = formatNumber(totalExp, 'exp');
            if (percent > 0 ) {
                document.querySelector(DOMstrings.expPercent).textContent = percent + '%';
            } else {
                document.querySelector(DOMstrings.expPercent).textContent = '---';    
            }
            
        },

        displayPercentages: function(percentages){

            var fields = document.querySelectorAll(DOMstrings.expensePercentageInd);

            nodeListForEach(fields, function(element, index){
                if (percentages[index] > 0){
                    element.textContent = percentages[index] + '%';
                } else {
                    element.textContent = '---';
                }
            });
        },
        
        displayDate: function() {

            var now, year, month, months;
            now = new Date();
            month = now.getMonth();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
            
        },

        changeType: function() {

            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' + DOMstrings.inputDescription + ',' + DOMstrings.inputValue
            );

            nodeListForEach(fields, function(element){
                element.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputButton).classList.toggle('red');
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    };

})();

const controller = (function(budgetCtrl, UICtrl){
    var setupEventListeners = function() {
        const DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(e){
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
    };

    var updateBudget = function () {
        var budget;
        //calculate budget
        budgetCtrl.calcBudget();
        //return budget
        budget = budgetCtrl.getBudget();
        //display budget on ui
        UICtrl.displayBudget(budget.budget, budget.totalInc, budget.totalExp, budget.percent);
    };

    var updatePercentages = function () {

        var percentages;
        //calculate percentages
        budgetCtrl.calcPercentages();
        //read percentages from data controller
        percentages = budgetCtrl.getPercentages();
        //update ui
        UICtrl.displayPercentages(percentages);

    };

    var ctrlAddItem = function () {
        var input, newItem;
        //get input
        input = UICtrl.getInput();
        if (input.description !== '' && !isNaN(input.value) && input.value > 0){
            //add input to budgetCtrl (data)
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            //add item to UIcontroller (ui)
            UICtrl.addListItem(newItem, input.type);
            //clear fields
            UICtrl.clearFields();
            //update budget
            updateBudget();
            //update percentages
            updatePercentages();
        }
    };

    var ctrlDeleteItem = function(e) {
        var targetID, splitID, type, ID;
        targetID = e.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if (targetID) {

            splitID = targetID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //delete item from data
            budgetCtrl.deleteItem(ID, type);
            //delete item from ui
            UICtrl.deleteItem(targetID);
            // update and show new budget
            updateBudget();
            //update percentages
            updatePercentages();
        }
    };

    return {
        init: function(){
            console.log('app started');
            setupEventListeners();
            UICtrl.displayBudget(0,0,0,-1);
            UICtrl.displayDate();
        }
    };

})(budgetController, UIController);

controller.init();