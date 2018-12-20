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
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percent: data.percent
            }
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
        expPercent: '.budget__expenses--percentage'
    }
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
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp'){
                element = document.querySelector(DOMstrings.expenseList);
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.amount);            
            
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

        displayBudget: function(budget, totalInc, totalExp, percent){
            document.querySelector(DOMstrings.budgetDisplay).textContent = budget;
            document.querySelector(DOMstrings.totalIncDisplay).textContent = '+ ' + totalInc;
            document.querySelector(DOMstrings.totalExpDisplay).textContent = '- ' + totalExp;
            document.querySelector(DOMstrings.expPercent).textContent = percent + '%';
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
        }
    };

    return {
        init: function(){
            console.log('app started');
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();